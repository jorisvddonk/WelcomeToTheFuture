import { Achievement } from "./Achievement";

export class AchievementsDAO {
    public achievements: Achievement[] = [];
    private listeners: ((achievement: Achievement) => void)[] = [];
    constructor() {
        this.achievements.push(new Achievement("rename", "No Fun Allowed", "Renamed the ship according to your own personal tastes."));
        this.achievements.push(new Achievement("read_inbox", "Talk to the Hand", "Marked an inbox message as 'read'."));
        this.achievements.push(new Achievement("hyperspace", "Underway on Antimatter Power", "Made your first hyperspace jump!"));
        this.achievements.push(new Achievement("translate", "Babelfish", "Translated a message from an alien language!"));
        this.achievements.push(new Achievement("narrow_escape", "Exceptionally Handled", "Narrowly escaped imminent death and destruction!"));
    }

    public get(achievementid: string) {
        const achievement = this.achievements.find(achievement => achievement.id === achievementid);
        if (achievement === undefined) {
            throw new Error("Achievement not found");
        }
        return achievement;
    }

    public unlock(achievementid: string): boolean {
        const achievement = this.get(achievementid);
        if (achievement.isUnlocked === false) {
            achievement.isUnlocked = true;
            this.listeners.forEach((listener) => {
                listener(achievement);
            });
            return true;
        }
        return false;
    }

    public addAchievementUnlockedListener(listener: (achievement: Achievement) => void) {
        this.listeners.push(listener);
    }

}

export const Achievements = new AchievementsDAO();