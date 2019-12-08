import { Achievement } from "./Achievement";

export class AchievementsDAO {
    public achievements: Achievement[] = [];
    private listeners: ((achievement: Achievement) => void)[] = [];
    constructor() {
        this.achievements.push(new Achievement("get_name", "Read nametag", "Get the starship's name", true));

        this.achievements.push(new Achievement("thrust", "Ramming speed!", "Use the ship's thrusters", true));
        this.achievements.push(new Achievement("turn", "Twist and turn", "Turn around", true));
        this.achievements.push(new Achievement("autopilot", "Autopilot", "Use the ship's autopilot", true));
        this.achievements.push(new Achievement("halt", "Halt!", "Make the ship stop using halt", true));
        this.achievements.push(new Achievement("control_mastery", "Master of Ship Controls", "Master all of the ship's controls", true));

        this.achievements.push(new Achievement("rename", "No Fun Allowed", "Renamed the ship according to your own personal tastes."));
        this.achievements.push(new Achievement("read_inbox", "Talk to the Hand", "Marked an inbox message as 'read'.", true));
        this.achievements.push(new Achievement("hyperspace", "Underway on Antimatter Power", "Made your first hyperspace jump!"));
        this.achievements.push(new Achievement("translate", "Babelfish", "Translated a message from an alien language!"));
        this.achievements.push(new Achievement("narrow_escape", "Exceptionally Handled", "Narrowly escaped imminent death and destruction!", true));
        this.achievements.push(new Achievement("can_land", "Orbit Established", "Orbiting around a habitable world!"));
        this.achievements.push(new Achievement("land", "Touchdown", "Landed on a habitable world!"));
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

    public isUnlocked(achievementid: string): boolean {
        const achievement = this.get(achievementid);
        return achievement.isUnlocked;
    }

    public isUnlockedAll(achievementids: string[]): boolean {
        return achievementids.reduce((memo, achievementid) => {
            return memo && this.isUnlocked(achievementid);
        }, true);
    }

    public addAchievementUnlockedListener(listener: (achievement: Achievement) => void) {
        this.listeners.push(listener);
    }

}

export const Achievements = new AchievementsDAO();