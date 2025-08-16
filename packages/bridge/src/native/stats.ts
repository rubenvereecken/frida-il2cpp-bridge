import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === STATS FUNCTIONS ===
/**
 * Dumps statistics to a file.
 * @param path const char* - The file path to dump stats to
 * @returns bool - True if successful
 */
export const nativeStatsDumpToFile = lazy(() =>
    lookup('il2cpp_stats_dump_to_file', 'bool', ['pointer'])
);

/**
 * Gets a specific statistic value.
 * @param stat Il2CppStat - The statistic to retrieve
 * @returns uint64_t - The statistic value
 */
export const nativeStatsGetValue = lazy(() => lookup('il2cpp_stats_get_value', 'uint64', ['int']));
