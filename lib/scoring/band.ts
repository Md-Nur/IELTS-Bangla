/**
 * Band Score Calculation for IELTS Academic Reading
 * Uses test-version-specific band conversion tables.
 */

export interface BandConversionRange {
  min: number;
  max: number;
  band: number;
}

/**
 * Standard Academic Reading raw-to-band conversion table
 * Direct transcription from resource/Mock_01_Answer_Key.pdf
 */
export const DEFAULT_ACADEMIC_READING_BAND_TABLE: BandConversionRange[] = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7.0 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6.0 },
  { min: 19, max: 22, band: 5.5 },
  { min: 15, max: 18, band: 5.0 },
  { min: 13, max: 14, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 8, max: 9, band: 3.5 },
  { min: 6, max: 7, band: 3.0 },
  { min: 4, max: 5, band: 2.5 },
  { min: 3, max: 3, band: 2.0 },
  { min: 2, max: 2, band: 1.5 },
  { min: 1, max: 1, band: 1.0 },
  { min: 0, max: 0, band: 0.0 },
];

export const MOCK_01_BAND_TABLE = DEFAULT_ACADEMIC_READING_BAND_TABLE;

/**
 * Maps a raw score (0 to totalQuestions) to an estimated IELTS Band (0.0 to 9.0)
 * using the test version's specific conversion table.
 */
export function calculateEstimatedBand(
  rawScore: number,
  conversionTable: BandConversionRange[] = DEFAULT_ACADEMIC_READING_BAND_TABLE
): number {
  if (rawScore < 0) return 0.0;

  for (const entry of conversionTable) {
    if (rawScore >= entry.min && rawScore <= entry.max) {
      return entry.band;
    }
  }

  // If score exceeds max configured, return highest band
  if (conversionTable.length > 0 && rawScore > conversionTable[0].max) {
    return conversionTable[0].band;
  }

  return 0.0;
}

export const getAcademicReadingBandScore = calculateEstimatedBand;
