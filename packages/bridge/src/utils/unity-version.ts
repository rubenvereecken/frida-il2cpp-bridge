/** @internal */
export class UnityVersion {
    private static readonly pattern = /(6\d{3}|20\d{2}|\d)\.(\d)\.(\d{1,2})(?:[abcfp]|rc){0,2}\d?/;

    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly versionString: string;

    constructor(versionString: string) {
        if (!versionString) {
            throw new Error('Version string cannot be empty');
        }

        const match = versionString.match(UnityVersion.pattern);
        if (!match) {
            throw new Error(`Invalid Unity version format: "${versionString}"`);
        }

        this.versionString = match[0];
        this.major = Number(match[1]);
        this.minor = Number(match[2]);
        this.patch = Number(match[3]);

        // Additional validation
        if (isNaN(this.major) || isNaN(this.minor) || isNaN(this.patch)) {
            throw new Error(`Failed to parse version components from: "${versionString}"`);
        }
    }

    static find(string: string | null): UnityVersion | null {
        if (!string) return null;

        const match = string.match(this.pattern)?.[0];
        if (!match) return null;

        try {
            return new UnityVersion(match);
        } catch {
            return null;
        }
    }

    gte(other: UnityVersion): boolean {
        return this.compare(other) >= 0;
    }

    lt(other: UnityVersion): boolean {
        return this.compare(other) < 0;
    }

    gt(other: UnityVersion): boolean {
        return this.compare(other) > 0;
    }

    lte(other: UnityVersion): boolean {
        return this.compare(other) <= 0;
    }

    equals(other: UnityVersion): boolean {
        return this.compare(other) === 0;
    }

    compare(other: UnityVersion): -1 | 0 | 1 {
        if (!(other instanceof UnityVersion)) {
            throw new Error('Can only compare with another UnityVersion instance');
        }

        const components = [
            [this.major, other.major],
            [this.minor, other.minor],
            [this.patch, other.patch],
        ];

        for (const [a, b] of components) {
            if (a > b) return 1;
            else if (a < b) return -1;
        }

        return 0;
    }

    toString(): string {
        return this.versionString;
    }
}
