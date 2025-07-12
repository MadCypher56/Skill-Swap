import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a learning session
export const createLearningSession = async (req, res) => {
  try {
    const { title, description, skillName, sessionType, maxParticipants, scheduledDate } = req.body;
    const userId = req.user.id;

    const session = await prisma.learningSession.create({
      data: {
        title,
        description,
        skillName,
        sessionType, // 'LIVE', 'RECORDED', 'WORKSHOP'
        maxParticipants: maxParticipants || 10,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        hostId: userId,
        status: 'SCHEDULED'
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Create learning session error:', error);
    res.status(500).json({ message: 'Failed to create learning session' });
  }
};

// Get all learning sessions
export const getAllLearningSessions = async (req, res) => {
  try {
    const { skill, type, status } = req.query;
    
    let whereClause = {};
    
    if (skill) {
      whereClause.skillName = {
        contains: skill,
        mode: 'insensitive'
      };
    }
    
    if (type) {
      whereClause.sessionType = type;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const sessions = await prisma.learningSession.findMany({
      where: whereClause,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        },
        resources: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(sessions);
  } catch (error) {
    console.error('Get learning sessions error:', error);
    res.status(500).json({ message: 'Failed to get learning sessions' });
  }
};

// Get learning session by ID
export const getLearningSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.learningSession.findUnique({
      where: { id: sessionId },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        },
        resources: {
          orderBy: { createdAt: 'desc' }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Learning session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get learning session error:', error);
    res.status(500).json({ message: 'Failed to get learning session' });
  }
};

// Join a learning session
export const joinLearningSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await prisma.learningSession.findUnique({
      where: { id: sessionId },
      include: {
        participants: true
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Learning session not found' });
    }

    if (session.hostId === userId) {
      return res.status(400).json({ message: 'You cannot join your own session' });
    }

    const existingParticipant = session.participants.find(p => p.userId === userId);
    if (existingParticipant) {
      return res.status(400).json({ message: 'You are already a participant' });
    }

    if (session.participants.length >= session.maxParticipants) {
      return res.status(400).json({ message: 'Session is full' });
    }

    const participant = await prisma.sessionParticipant.create({
      data: {
        sessionId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    res.json(participant);
  } catch (error) {
    console.error('Join learning session error:', error);
    res.status(500).json({ message: 'Failed to join learning session' });
  }
};

// Leave a learning session
export const leaveLearningSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    await prisma.sessionParticipant.deleteMany({
      where: {
        sessionId,
        userId
      }
    });

    res.json({ message: 'Left session successfully' });
  } catch (error) {
    console.error('Leave learning session error:', error);
    res.status(500).json({ message: 'Failed to leave learning session' });
  }
};

// Update learning session
export const updateLearningSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const session = await prisma.learningSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ message: 'Learning session not found' });
    }

    if (session.hostId !== userId) {
      return res.status(403).json({ message: 'Only the host can update this session' });
    }

    const updatedSession = await prisma.learningSession.update({
      where: { id: sessionId },
      data: updateData,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    res.json(updatedSession);
  } catch (error) {
    console.error('Update learning session error:', error);
    res.status(500).json({ message: 'Failed to update learning session' });
  }
};

// Delete learning session
export const deleteLearningSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await prisma.learningSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ message: 'Learning session not found' });
    }

    if (session.hostId !== userId) {
      return res.status(403).json({ message: 'Only the host can delete this session' });
    }

    await prisma.learningSession.delete({
      where: { id: sessionId }
    });

    res.json({ message: 'Learning session deleted successfully' });
  } catch (error) {
    console.error('Delete learning session error:', error);
    res.status(500).json({ message: 'Failed to delete learning session' });
  }
}; 