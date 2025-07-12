import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const sendSwapRequest = async (req, res) => {
  const fromUserId = req.user.id;
  const { toUserId } = req.body;

  try {
    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "You cannot request a swap with yourself." });
    }

    const existingRequest = await prisma.swapRequest.findFirst({
      where: {
        fromUserId,
        toUserId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Swap request already pending." });
    }

    const request = await prisma.swapRequest.create({
      data: {
        fromUserId,
        toUserId,
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: "Swap request sent!", request });
  } catch (error) {
    console.error("Error sending swap request:", error);
    res.status(500).json({ message: "Failed to send swap request." });
  }
};


export const getSwapRequests = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const received = await prisma.swapRequest.findMany({
        where: { toUserId: userId },
        include: {
          fromUser: {
            select: { id: true, name: true, profilePic: true },
          },
        },
      });
  
      const sent = await prisma.swapRequest.findMany({
        where: { fromUserId: userId },
        include: {
          toUser: {
            select: { id: true, name: true, profilePic: true },
          },
        },
      });
  
      res.json({ received, sent });
    } catch (error) {
      console.error("Error fetching swap requests:", error);
      res.status(500).json({ message: "Failed to fetch requests." });
    }
  };
  
  export const respondToSwapRequest = async (req, res) => {
    const { requestId, action } = req.body;
    const userId = req.user.id;
  
    try {
      const request = await prisma.swapRequest.findUnique({ where: { id: requestId } });
  
      if (!request || request.toUserId !== userId) {
        return res.status(403).json({ message: "Unauthorized or invalid request" });
      }
  
      let updatedStatus = 'REJECTED';
      if (action === 'accept') updatedStatus = 'ACCEPTED';
  
      await prisma.swapRequest.update({
        where: { id: requestId },
        data: { status: updatedStatus },
      });
  
      res.json({ message: `Swap ${updatedStatus.toLowerCase()} successfully` });
    } catch (error) {
      console.error("Respond error:", error);
      res.status(500).json({ message: "Failed to respond to request." });
    }
  };
  
  export const deleteSwapRequest = async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user.id;
  
    try {
      const request = await prisma.swapRequest.findUnique({ where: { id: requestId } });
  
      if (!request || request.fromUserId !== userId || request.status !== 'PENDING') {
        return res.status(403).json({ message: "Cannot delete this request" });
      }
  
      await prisma.swapRequest.delete({ where: { id: requestId } });
      res.json({ message: "Request deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Failed to delete request." });
    }
  };
  