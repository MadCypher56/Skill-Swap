import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Upload a resource (file, code, image, video)
export const uploadResource = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title, description, resourceType, content, fileUrl } = req.body;
    const userId = req.user.id;

    // Validate resource type
    const validTypes = ['CODE', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LINK'];
    if (!validTypes.includes(resourceType)) {
      return res.status(400).json({ message: 'Invalid resource type' });
    }

    // Check if session exists
    const session = await prisma.learningSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ message: 'Learning session not found' });
    }

    const resource = await prisma.resource.create({
      data: {
        sessionId,
        uploadedBy: userId,
        title,
        description,
        resourceType,
        content,
        fileUrl
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({ message: 'Failed to upload resource' });
  }
};

// Get resources for a session
export const getSessionResources = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { type } = req.query;

    let whereClause = { sessionId };
    
    if (type) {
      whereClause.resourceType = type;
    }

    const resources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        uploadedByUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
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
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(resources);
  } catch (error) {
    console.error('Get session resources error:', error);
    res.status(500).json({ message: 'Failed to get session resources' });
  }
};

// Update a resource
export const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId }
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.uploadedBy !== userId) {
      return res.status(403).json({ message: 'Only the uploader can update this resource' });
    }

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: updateData,
      include: {
        uploadedByUser: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    res.json(updatedResource);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Failed to update resource' });
  }
};

// Delete a resource
export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId }
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.uploadedBy !== userId) {
      return res.status(403).json({ message: 'Only the uploader can delete this resource' });
    }

    await prisma.resource.delete({
      where: { id: resourceId }
    });

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Failed to delete resource' });
  }
};

// Add comment to a resource
export const addResourceComment = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await prisma.resourceComment.create({
      data: {
        resourceId,
        userId,
        content
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

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add resource comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Get comments for a resource
export const getResourceComments = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const comments = await prisma.resourceComment.findMany({
      where: { resourceId },
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
    });

    res.json(comments);
  } catch (error) {
    console.error('Get resource comments error:', error);
    res.status(500).json({ message: 'Failed to get comments' });
  }
}; 