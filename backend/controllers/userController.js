import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skillsOffered: { select: { name: true } },
        skillsWanted: { select: { name: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware (JWT)
    const {
      name,
      location,
      profilePic,
      availability,
      isPublic,
      skillsOffered,
      skillsWanted,
    } = req.body;

    console.log('Update profile request:', {
      userId,
      name,
      location,
      profilePic,
      availability,
      isPublic,
      skillsOffered,
      skillsWanted,
    });

    // Update user basic info
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        location,
        profilePic,
        availability,
        isPublic,
      },
    });

    // Remove existing skills for user
    await prisma.skill.deleteMany({
      where: {
        OR: [
          { offeredByUserId: userId },
          { wantedByUserId: userId },
        ],
      },
    });

    // Add new offered skills
    if (Array.isArray(skillsOffered)) {
      for (const skill of skillsOffered) {
        // Handle both string and object formats
        const skillName = typeof skill === 'string' ? skill : skill.name;
        if (skillName) {
          await prisma.skill.create({
            data: {
              name: skillName,
              type: 'OFFERED',
              offeredByUserId: userId,
            },
          });
        }
      }
    }

    // Add new wanted skills
    if (Array.isArray(skillsWanted)) {
      for (const skill of skillsWanted) {
        // Handle both string and object formats
        const skillName = typeof skill === 'string' ? skill : skill.name;
        if (skillName) {
          await prisma.skill.create({
            data: {
              name: skillName,
              type: 'WANTED',
              wantedByUserId: userId,
            },
          });
        }
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

export const getPublicUsers = async (req, res) => {
    try {
      const { search } = req.query;
      
      let whereClause = {
        isPublic: true,
        isBanned: false,
        id: { not: req.user.id },
      };

      // Add search functionality
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { skillsOffered: { some: { name: { contains: search, mode: 'insensitive' } } } },
          { skillsWanted: { some: { name: { contains: search, mode: 'insensitive' } } } },
        ];
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          location: true,
          availability: true,
          skillsOffered: {
            select: { name: true }
          },
          skillsWanted: {
            select: { name: true }
          },
          profilePic: true
        },
      });
  
      res.json(users);
    } catch (err) {
      console.error('Get public users error:', err);
      res.status(500).json({ message: 'Failed to get users' });
    }
  };
  