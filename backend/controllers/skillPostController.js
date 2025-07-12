import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a skill post
export const createSkillPost = async (req, res) => {
  try {
    const { skillName, description, postType } = req.body;
    const userId = req.user.id;

    console.log('Creating skill post:', { skillName, description, postType, userId });

    const post = await prisma.skillPost.create({
      data: {
        userId,
        skillName,
        description,
        postType
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            location: true,
            profilePic: true
          }
        }
      }
    });

    console.log('Skill post created:', post);
    res.status(201).json(post);
  } catch (error) {
    console.error('Create skill post error:', error);
    res.status(500).json({ message: 'Failed to create skill post', error: error.message });
  }
};

// Get all skill posts
export const getAllSkillPosts = async (req, res) => {
  try {
    const { type, skill } = req.query;
    
    console.log('Getting skill posts with query:', { type, skill });
    
    let whereClause = {};
    
    if (type) {
      whereClause.postType = type;
    }
    
    if (skill) {
      whereClause.skillName = {
        contains: skill,
        mode: 'insensitive'
      };
    }

    console.log('Where clause:', whereClause);

    const posts = await prisma.skillPost.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            location: true,
            profilePic: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${posts.length} skill posts`);
    res.json(posts);
  } catch (error) {
    console.error('Get skill posts error:', error);
    res.status(500).json({ message: 'Failed to get skill posts', error: error.message });
  }
};

// Get skill posts for current user
export const getMySkillPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting skill posts for user:', userId);

    const posts = await prisma.skillPost.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            location: true,
            profilePic: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${posts.length} posts for user ${userId}`);
    res.json(posts);
  } catch (error) {
    console.error('Get my skill posts error:', error);
    res.status(500).json({ message: 'Failed to get your skill posts', error: error.message });
  }
};

// Get skill recommendations for current user
export const getSkillRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting recommendations for user:', userId);

    // Get current user's skill posts and profile
    const [myPosts, myProfile] = await Promise.all([
      prisma.skillPost.findMany({
        where: { userId }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { location: true, availability: true }
      })
    ]);

    console.log(`User has ${myPosts.length} posts`);

    const recommendations = [];

    // For each of my posts, find matching posts from others
    for (const myPost of myPosts) {
      // Find exact skill matches
      const exactMatches = await prisma.skillPost.findMany({
        where: {
          userId: { not: userId },
          skillName: myPost.skillName,
          postType: myPost.postType === 'OFFERING' ? 'SEEKING' : 'OFFERING'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              location: true,
              profilePic: true,
              availability: true
            }
          }
        }
      });

      // Find similar skill matches (fuzzy matching)
      const similarMatches = await prisma.skillPost.findMany({
        where: {
          userId: { not: userId },
          skillName: {
            contains: myPost.skillName.split(' ')[0], // Match first word
            mode: 'insensitive'
          },
          postType: myPost.postType === 'OFFERING' ? 'SEEKING' : 'OFFERING',
          skillName: { not: myPost.skillName } // Exclude exact matches
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              location: true,
              profilePic: true,
              availability: true
            }
          }
        }
      });

      // Calculate match scores
      const scoredMatches = [...exactMatches, ...similarMatches].map(match => {
        let score = 0;
        
        // Exact skill match gets highest score
        if (match.skillName.toLowerCase() === myPost.skillName.toLowerCase()) {
          score += 100;
        } else {
          score += 50; // Similar skill
        }

        // Location bonus (if both users have location)
        if (myProfile?.location && match.user.location) {
          if (myProfile.location.toLowerCase() === match.user.location.toLowerCase()) {
            score += 30;
          }
        }

        // Availability bonus
        if (myProfile?.availability && match.user.availability) {
          const commonAvailability = myProfile.availability.filter(avail => 
            match.user.availability.includes(avail)
          );
          score += commonAvailability.length * 10;
        }

        // Description quality bonus
        if (match.description && match.description.length > 10) {
          score += 5;
        }

        return { ...match, score };
      });

      // Sort by score and take top matches
      const topMatches = scoredMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      recommendations.push({
        mySkill: myPost,
        matches: topMatches,
        totalMatches: scoredMatches.length
      });
    }

    console.log(`Generated ${recommendations.length} recommendations`);
    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Failed to get recommendations', error: error.message });
  }
};

// Delete a skill post
export const deleteSkillPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    console.log('Deleting skill post:', { postId, userId });

    const post = await prisma.skillPost.findUnique({
      where: { id: postId }
    });

    if (!post || post.userId !== userId) {
      return res.status(403).json({ message: 'Cannot delete this post' });
    }

    await prisma.skillPost.delete({
      where: { id: postId }
    });

    console.log('Skill post deleted successfully');
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete skill post error:', error);
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
}; 