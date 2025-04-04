import express from 'express';
import { authenticate } from '../middleware/auth';
import Website from '../models/Website';
import Activity from '../models/Activity';
import UserProgress from '../models/UserProgress';
import { Request, Response } from 'express';

const router = express.Router();

// Get dashboard overview
router.get('/overview', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    // Get websites
    const websites = await Website.find({ 
      $or: [{ owner: userId }, { teamMembers: userId }] 
    });

    // Get total content count
    const totalContent = websites.reduce((acc, website) => acc + website.contentCount, 0);

    // Get recent activities
    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('website', 'name')
      .populate('user', 'name');

    // Get user progress
    const progress = await UserProgress.findOne({ user: userId });

    res.json({
      websites: websites.length,
      totalContent,
      teamMembers: websites.reduce((acc, website) => acc + website.teamMembers.length, 0),
      apiUsage: websites.reduce((acc, website) => acc + website.apiUsage, 0),
      activities,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get website status
router.get('/websites', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const websites = await Website.find({ 
      $or: [{ owner: userId }, { teamMembers: userId }] 
    }).populate('teamMembers', 'name');

    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching websites' });
  }
});

// Get content performance
router.get('/performance', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { period = '7D' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case '7D':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30D':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90D':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    // Get activities within date range
    const activities = await Activity.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: now }
    });

    // Process activities to create performance data
    const performanceData = activities.reduce((acc: any, activity) => {
      const date = activity.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          contentUpdates: 0,
          contentCreates: 0,
          apiCalls: 0
        };
      }
      
      switch (activity.type) {
        case 'content_update':
          acc[date].contentUpdates++;
          break;
        case 'content_create':
          acc[date].contentCreates++;
          break;
        case 'api_usage':
          acc[date].apiCalls++;
          break;
      }
      
      return acc;
    }, {});

    res.json(performanceData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance data' });
  }
});

// Update user progress
router.post('/progress', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { type, points } = req.body;

    const progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    // Update specific progress type
    switch (type) {
      case 'contentCreation':
        progress.contentCreation += points;
        break;
      case 'teamCollaboration':
        progress.teamCollaboration += points;
        break;
      case 'apiUsage':
        progress.apiUsage += points;
        break;
    }

    // Update total points and check for level up
    progress.points += points;
    const newLevel = Math.floor(progress.points / 1000) + 1;
    if (newLevel > progress.level) {
      progress.level = newLevel;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress' });
  }
});

export default router; 