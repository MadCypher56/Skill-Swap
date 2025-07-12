import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a certification/endorsement
export const createCertification = async (req, res) => {
  try {
    const { sessionId, swapRequestId, endorsedFor, skillName, endorsementText, rating } = req.body;
    const endorsedBy = req.user.id;

    // Validate that the session exists and is completed
    const session = await prisma.learningSession.findUnique({
      where: { id: sessionId },
      include: { swapRequest: true }
    });

    if (!session) {
      return res.status(404).json({ message: 'Learning session not found' });
    }

    if (session.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Session must be completed before creating certification' });
    }

    // Validate that the user is part of the swap request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId }
    });

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swapRequest.fromUserId !== endorsedBy && swapRequest.toUserId !== endorsedBy) {
      return res.status(403).json({ message: 'You can only create certifications for your swap partners' });
    }

    // Check if certification already exists
    const existingCertification = await prisma.certification.findFirst({
      where: {
        sessionId,
        endorsedBy,
        endorsedFor
      }
    });

    if (existingCertification) {
      return res.status(400).json({ message: 'Certification already exists for this session and user' });
    }

    const certification = await prisma.certification.create({
      data: {
        sessionId,
        swapRequestId,
        endorsedBy,
        endorsedFor,
        skillName,
        endorsementText,
        rating: rating || 5,
        isCompleted: true
      },
      include: {
        endorsedUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        endorsedForUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        session: {
          select: {
            title: true,
            skillName: true
          }
        }
      }
    });

    res.status(201).json(certification);
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).json({ message: 'Failed to create certification' });
  }
};

// Get certifications for a user
export const getUserCertifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const certifications = await prisma.certification.findMany({
      where: {
        OR: [
          { endorsedBy: userId },
          { endorsedFor: userId }
        ]
      },
      include: {
        endorsedUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        endorsedForUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        session: {
          select: {
            title: true,
            skillName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(certifications);
  } catch (error) {
    console.error('Get user certifications error:', error);
    res.status(500).json({ message: 'Failed to get certifications' });
  }
};

// Get certifications for a specific session
export const getSessionCertifications = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const certifications = await prisma.certification.findMany({
      where: { sessionId },
      include: {
        endorsedUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        endorsedForUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(certifications);
  } catch (error) {
    console.error('Get session certifications error:', error);
    res.status(500).json({ message: 'Failed to get session certifications' });
  }
};

// Update certification
export const updateCertification = async (req, res) => {
  try {
    const { certificationId } = req.params;
    const userId = req.user.id;
    const { endorsementText, rating } = req.body;

    const certification = await prisma.certification.findUnique({
      where: { id: certificationId }
    });

    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    if (certification.endorsedBy !== userId) {
      return res.status(403).json({ message: 'Only the endorser can update this certification' });
    }

    const updatedCertification = await prisma.certification.update({
      where: { id: certificationId },
      data: {
        endorsementText,
        rating
      },
      include: {
        endorsedUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        endorsedForUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    res.json(updatedCertification);
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({ message: 'Failed to update certification' });
  }
};

// Delete certification
export const deleteCertification = async (req, res) => {
  try {
    const { certificationId } = req.params;
    const userId = req.user.id;

    const certification = await prisma.certification.findUnique({
      where: { id: certificationId }
    });

    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    if (certification.endorsedBy !== userId) {
      return res.status(403).json({ message: 'Only the endorser can delete this certification' });
    }

    await prisma.certification.delete({
      where: { id: certificationId }
    });

    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({ message: 'Failed to delete certification' });
  }
};

// Get certifications for a swap request
export const getSwapRequestCertifications = async (req, res) => {
  try {
    const { swapRequestId } = req.params;

    const certifications = await prisma.certification.findMany({
      where: { swapRequestId },
      include: {
        endorsedUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        endorsedForUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        session: {
          select: {
            title: true,
            skillName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(certifications);
  } catch (error) {
    console.error('Get swap request certifications error:', error);
    res.status(500).json({ message: 'Failed to get swap request certifications' });
  }
}; 