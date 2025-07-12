import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Admin Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalSwaps = await prisma.swapRequest.count();
    const pendingSwaps = await prisma.swapRequest.count({
      where: { status: 'PENDING' }
    });
    const totalFeedback = await prisma.feedback.count();
    const bannedUsers = await prisma.user.count({
      where: { isBanned: true }
    });

    res.json({
      totalUsers,
      totalSwaps,
      pendingSwaps,
      totalFeedback,
      bannedUsers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to get dashboard stats' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        isPublic: true,
        isBanned: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            sentRequests: true,
            receivedRequests: true,
            feedbacksReceived: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// Ban/Unban user
export const toggleUserBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBanned } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBanned }
    });

    res.json({ 
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      user 
    });
  } catch (error) {
    console.error('Toggle user ban error:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Get all swap requests
export const getAllSwapRequests = async (req, res) => {
  try {
    const requests = await prisma.swapRequest.findMany({
      include: {
        fromUser: {
          select: { id: true, name: true, email: true }
        },
        toUser: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error('Get all swap requests error:', error);
    res.status(500).json({ message: 'Failed to get swap requests' });
  }
};

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      include: {
        fromUser: {
          select: { id: true, name: true }
        },
        toUser: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(feedback);
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({ message: 'Failed to get feedback' });
  }
};

// Get platform analytics
export const getPlatformAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalSwaps,
      completedSwaps,
      totalFeedback,
      averageRating,
      topSkills,
      recentActivity
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (users with posts or swaps in last 30 days)
      prisma.user.count({
        where: {
          OR: [
            { skillPosts: { some: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } } },
            { sentRequests: { some: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } } },
            { receivedRequests: { some: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } } }
          ]
        }
      }),
      
      // Total swaps
      prisma.swapRequest.count(),
      
      // Completed swaps
      prisma.swapRequest.count({ where: { status: 'ACCEPTED' } }),
      
      // Total feedback
      prisma.feedback.count(),
      
      // Average rating
      prisma.feedback.aggregate({
        _avg: { rating: true }
      }),
      
      // Top skills
      prisma.skillPost.groupBy({
        by: ['skillName'],
        _count: { skillName: true },
        orderBy: { _count: { skillName: 'desc' } },
        take: 10
      }),
      
      // Recent activity
      prisma.swapRequest.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          fromUser: { select: { name: true } },
          toUser: { select: { name: true } }
        }
      })
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalSwaps,
      completedSwaps,
      completionRate: totalSwaps > 0 ? (completedSwaps / totalSwaps * 100).toFixed(1) : 0,
      totalFeedback,
      averageRating: averageRating._avg.rating || 0,
      topSkills,
      recentActivity
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to get analytics' });
  }
};

// Get all skill posts (admin view)
export const getAllSkillPosts = async (req, res) => {
  try {
    const posts = await prisma.skillPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get all skill posts error:', error);
    res.status(500).json({ message: 'Failed to get skill posts' });
  }
};

// Delete skill post (admin)
export const deleteSkillPost = async (req, res) => {
  try {
    const { postId } = req.params;

    await prisma.skillPost.delete({
      where: { id: postId }
    });

    res.json({ message: 'Skill post deleted successfully' });
  } catch (error) {
    console.error('Delete skill post error:', error);
    res.status(500).json({ message: 'Failed to delete skill post' });
  }
};

// Send platform announcement
export const sendAnnouncement = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    // In a real app, you'd store this in a database and send notifications
    // For now, we'll just return success
    res.json({ 
      message: 'Announcement sent successfully',
      announcement: { title, message, type, createdAt: new Date() }
    });
  } catch (error) {
    console.error('Send announcement error:', error);
    res.status(500).json({ message: 'Failed to send announcement' });
  }
};

// Get user activity report
export const getUserActivityReport = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userActivity = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            skillPosts: true,
            sentRequests: true,
            receivedRequests: true,
            feedbacksGiven: true,
            feedbacksReceived: true
          }
        },
        skillPosts: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        sentRequests: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            toUser: { select: { name: true } }
          }
        },
        receivedRequests: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            fromUser: { select: { name: true } }
          }
        }
      }
    });

    res.json(userActivity);
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ message: 'Failed to get user activity' });
  }
}; 