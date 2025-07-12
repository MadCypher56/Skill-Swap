import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const submitFeedback = async (req, res) => {
  const fromUserId = req.user.id;
  const { toUserId, rating, comment } = req.body;

  if (!toUserId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid feedback" });
  }

  try {
    // Check if there's an accepted swap between users
    const hasAcceptedSwap = await prisma.swapRequest.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      },
    });

    if (!hasAcceptedSwap) {
      return res.status(403).json({ message: "No completed swap between users" });
    }

    // Optional: Check if feedback already given
    const existing = await prisma.feedback.findFirst({
      where: {
        fromUserId,
        toUserId,
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    await prisma.feedback.create({
      data: {
        fromUserId,
        toUserId,
        rating,
        comment,
      },
    });

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};
