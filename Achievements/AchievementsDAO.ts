import { Achievement } from "./Achievement";

export class AchievementsDAO {
    public achievements: Achievement[] = [];
    private listeners: ((achievement: Achievement) => void)[] = [];
    constructor() {
        this.achievements.push(new Achievement("name", "Uncovered the label", "Figured out what the ship's name is"));
    }

    public get(achievementid: string) {
        const achievement = this.achievements.find(achievement => achievement.id === achievementid);
        if (achievement === undefined) {
            throw new Error("Achievement not found");
        }
        return achievement;
    }

    public unlock(achievementid: string) {
        const achievement = this.get(achievementid);
        if (achievement.isUnlocked === false) {
            achievement.isUnlocked = true;
            this.listeners.forEach((listener) => {
                listener(achievement);
            });
        }
    }

    public addAchievementUnlockedListener(listener: (achievement: Achievement) => void) {
        this.listeners.push(listener);
    }

}

export const Achievements = new AchievementsDAO();