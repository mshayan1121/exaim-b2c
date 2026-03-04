export const APP_NAME = 'ExAIm'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

// Freemium limits
export const FREE_STUDENT_PAPERS_PER_MONTH = 3
export const FREE_TEACHER_MAX_STUDENTS = 5
export const FREE_TEACHER_ASSIGNMENTS_PER_MONTH = 3

// Exam
export const EXAM_TIMER_WARNING_MINS = 5
export const EXAM_TIMER_DANGER_MINS = 1
export const EXAM_AUTOSAVE_INTERVAL_MS = 30000
export const MAX_ANSWER_LENGTH = 5000

// AI
export const CLAUDE_MODEL = 'claude-sonnet-4-5'
export const MAX_TUTOR_MESSAGES = 50

// Rate limits
export const RATE_LIMIT_EVALUATION_PER_HOUR = 60
export const RATE_LIMIT_EXAM_GENERATION_PER_HOUR = 10
export const RATE_LIMIT_QUESTION_GENERATION_PER_HOUR = 30
export const RATE_LIMIT_TUTOR_PER_HOUR = 100
export const RATE_LIMIT_HIERARCHY_GENERATION_PER_HOUR = 20

// Gamification
export const XP_PER_EXAM_COMPLETION = 10
export const XP_STREAK_BONUS = 5
export const XP_HIGH_SCORE_BONUS = 15 // 80%+ score
export const PREDICTED_GRADE_MIN_ATTEMPTS = 3
export const STREAK_BREAK_DAYS = 1

// Invite links
export const INVITE_LINK_EXPIRY_DAYS = 7

// Upload limits
export const MAX_IMAGE_SIZE_MB = 5
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
