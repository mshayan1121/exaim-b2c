export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          class_id: string
          created_at: string | null
          deadline_at: string
          deleted_at: string | null
          duration_override_mins: number | null
          exam_id: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          deadline_at: string
          deleted_at?: string | null
          duration_override_mins?: number | null
          exam_id: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          deadline_at?: string
          deleted_at?: string | null
          duration_override_mins?: number | null
          exam_id?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          colour: string | null
          created_at: string | null
          criteria: string
          description: string
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          colour?: string | null
          created_at?: string | null
          criteria: string
          description: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          colour?: string | null
          created_at?: string | null
          criteria?: string
          description?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      class_students: {
        Row: {
          class_id: string
          id: string
          joined_at: string | null
          removed_at: string | null
          student_id: string
        }
        Insert: {
          class_id: string
          id?: string
          joined_at?: string | null
          removed_at?: string | null
          student_id: string
        }
        Update: {
          class_id?: string
          id?: string
          joined_at?: string | null
          removed_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          invite_expires_at: string
          invite_token: string
          is_archived: boolean | null
          name: string
          teacher_id: string
          updated_at: string | null
          year_group_label: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          invite_expires_at: string
          invite_token: string
          is_archived?: boolean | null
          name: string
          teacher_id: string
          updated_at?: string | null
          year_group_label?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          invite_expires_at?: string
          invite_token?: string
          is_archived?: boolean | null
          name?: string
          teacher_id?: string
          updated_at?: string | null
          year_group_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      claude_api_logs: {
        Row: {
          call_type: string
          created_at: string | null
          duration_ms: number | null
          id: string
          input_tokens: number | null
          output_tokens: number | null
          success: boolean
          user_id: string | null
        }
        Insert: {
          call_type: string
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          success: boolean
          user_id?: string | null
        }
        Update: {
          call_type?: string
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          success?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claude_api_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string
          enrolled_at: string | null
          id: string
          student_id: string
          unenrolled_at: string | null
        }
        Insert: {
          course_id: string
          enrolled_at?: string | null
          id?: string
          student_id: string
          unenrolled_at?: string | null
        }
        Update: {
          course_id?: string
          enrolled_at?: string | null
          id?: string
          student_id?: string
          unenrolled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          duplicated_from: string | null
          id: string
          is_published: boolean | null
          name: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          duplicated_from?: string | null
          id?: string
          is_published?: boolean | null
          name: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          duplicated_from?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_duplicated_from_fkey"
            columns: ["duplicated_from"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenge_attempts: {
        Row: {
          challenge_id: string
          completed_at: string | null
          id: string
          marks_awarded: number | null
          student_id: string
          xp_earned: number | null
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          id?: string
          marks_awarded?: number | null
          student_id: string
          xp_earned?: number | null
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          id?: string
          marks_awarded?: number | null
          student_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_challenge_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_challenge_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_date: string
          created_at: string | null
          id: string
          question_id: string
        }
        Insert: {
          challenge_date: string
          created_at?: string | null
          id?: string
          question_id: string
        }
        Update: {
          challenge_date?: string
          created_at?: string | null
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_challenges_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_results: {
        Row: {
          claude_model_used: string
          created_at: string | null
          error_carried_forward: boolean | null
          evaluation_duration_ms: number | null
          feedback_text: string
          id: string
          improvement_text: string | null
          marking_breakdown: Json
          marks_available: number
          marks_awarded: number
          question_attempt_id: string
        }
        Insert: {
          claude_model_used: string
          created_at?: string | null
          error_carried_forward?: boolean | null
          evaluation_duration_ms?: number | null
          feedback_text: string
          id?: string
          improvement_text?: string | null
          marking_breakdown: Json
          marks_available: number
          marks_awarded: number
          question_attempt_id: string
        }
        Update: {
          claude_model_used?: string
          created_at?: string | null
          error_carried_forward?: boolean | null
          evaluation_duration_ms?: number | null
          feedback_text?: string
          id?: string
          improvement_text?: string | null
          marking_breakdown?: Json
          marks_available?: number
          marks_awarded?: number
          question_attempt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_results_question_attempt_id_fkey"
            columns: ["question_attempt_id"]
            isOneToOne: false
            referencedRelation: "question_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_attempts: {
        Row: {
          assignment_id: string | null
          attempt_mode: string
          created_at: string | null
          duration_taken_secs: number | null
          exam_id: string
          id: string
          started_at: string | null
          status: string
          student_id: string
          submitted_at: string | null
          total_marks_available: number
          total_marks_awarded: number | null
          updated_at: string | null
          xp_earned: number | null
        }
        Insert: {
          assignment_id?: string | null
          attempt_mode: string
          created_at?: string | null
          duration_taken_secs?: number | null
          exam_id: string
          id?: string
          started_at?: string | null
          status: string
          student_id: string
          submitted_at?: string | null
          total_marks_available: number
          total_marks_awarded?: number | null
          updated_at?: string | null
          xp_earned?: number | null
        }
        Update: {
          assignment_id?: string | null
          attempt_mode?: string
          created_at?: string | null
          duration_taken_secs?: number | null
          exam_id?: string
          id?: string
          started_at?: string | null
          status?: string
          student_id?: string
          submitted_at?: string | null
          total_marks_available?: number
          total_marks_awarded?: number | null
          updated_at?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_boards: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          qualification_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          qualification_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          qualification_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_boards_qualification_id_fkey"
            columns: ["qualification_id"]
            isOneToOne: false
            referencedRelation: "qualifications"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_questions: {
        Row: {
          created_at: string | null
          exam_id: string
          id: string
          question_id: string
          question_order: number
        }
        Insert: {
          created_at?: string | null
          exam_id: string
          id?: string
          question_id: string
          question_order: number
        }
        Update: {
          created_at?: string | null
          exam_id?: string
          id?: string
          question_id?: string
          question_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          course_id: string | null
          created_at: string | null
          created_by: string
          creation_method: string
          deleted_at: string | null
          exam_type: string
          id: string
          is_ai_generated: boolean | null
          is_approved: boolean | null
          is_published: boolean | null
          name: string
          suggested_duration_mins: number | null
          total_marks: number
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          created_by: string
          creation_method: string
          deleted_at?: string | null
          exam_type: string
          id?: string
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          is_published?: boolean | null
          name: string
          suggested_duration_mins?: number | null
          total_marks?: number
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          created_by?: string
          creation_method?: string
          deleted_at?: string | null
          exam_type?: string
          id?: string
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          is_published?: boolean | null
          name?: string
          suggested_duration_mins?: number | null
          total_marks?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mark_schemes: {
        Row: {
          claude_notes: string | null
          created_at: string | null
          id: string
          model_answer: string
          question_id: string
          updated_at: string | null
        }
        Insert: {
          claude_notes?: string | null
          created_at?: string | null
          id?: string
          model_answer: string
          question_id: string
          updated_at?: string | null
        }
        Update: {
          claude_notes?: string | null
          created_at?: string | null
          id?: string
          model_answer?: string
          question_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mark_schemes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      marking_points: {
        Row: {
          created_at: string | null
          id: string
          mark_scheme_id: string
          point_order: number
          point_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mark_scheme_id: string
          point_order: number
          point_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mark_scheme_id?: string
          point_order?: number
          point_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marking_points_mark_scheme_id_fkey"
            columns: ["mark_scheme_id"]
            isOneToOne: false
            referencedRelation: "mark_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      mcq_options: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean
          option_order: number
          option_text: string
          question_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean
          option_order: number
          option_text: string
          question_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean
          option_order?: number
          option_text?: string
          question_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcq_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          badge_earned_inapp: boolean | null
          created_at: string | null
          deadline_reminder_email: boolean | null
          deadline_reminder_inapp: boolean | null
          feedback_ready_inapp: boolean | null
          id: string
          new_assignment_email: boolean | null
          new_assignment_inapp: boolean | null
          streak_alert_email: boolean | null
          streak_alert_inapp: boolean | null
          submission_email: boolean | null
          submission_inapp: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badge_earned_inapp?: boolean | null
          created_at?: string | null
          deadline_reminder_email?: boolean | null
          deadline_reminder_inapp?: boolean | null
          feedback_ready_inapp?: boolean | null
          id?: string
          new_assignment_email?: boolean | null
          new_assignment_inapp?: boolean | null
          streak_alert_email?: boolean | null
          streak_alert_inapp?: boolean | null
          submission_email?: boolean | null
          submission_inapp?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badge_earned_inapp?: boolean | null
          created_at?: string | null
          deadline_reminder_email?: boolean | null
          deadline_reminder_inapp?: boolean | null
          feedback_ready_inapp?: boolean | null
          id?: string
          new_assignment_email?: boolean | null
          new_assignment_inapp?: boolean | null
          streak_alert_email?: boolean | null
          streak_alert_inapp?: boolean | null
          submission_email?: boolean | null
          submission_inapp?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_read: boolean | null
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          reference_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          is_suspended: boolean | null
          is_verified: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          full_name: string
          id: string
          is_suspended?: boolean | null
          is_verified?: boolean | null
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_suspended?: boolean | null
          is_verified?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      qualifications: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          answer_content: Json | null
          created_at: string | null
          evaluation_result: Json | null
          evaluation_status: string | null
          exam_attempt_id: string
          id: string
          is_flagged: boolean | null
          marks_available: number
          marks_awarded: number | null
          question_id: string
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          answer_content?: Json | null
          created_at?: string | null
          evaluation_result?: Json | null
          evaluation_status?: string | null
          exam_attempt_id: string
          id?: string
          is_flagged?: boolean | null
          marks_available: number
          marks_awarded?: number | null
          question_id: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          answer_content?: Json | null
          created_at?: string | null
          evaluation_result?: Json | null
          evaluation_status?: string | null
          exam_attempt_id?: string
          id?: string
          is_flagged?: boolean | null
          marks_available?: number
          marks_awarded?: number | null
          question_id?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_exam_attempt_id_fkey"
            columns: ["exam_attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string
          deleted_at: string | null
          difficulty: string
          id: string
          image_url: string | null
          is_ai_generated: boolean | null
          is_approved: boolean | null
          parent_question_id: string | null
          part_label: string | null
          part_order: number | null
          question_type: string
          subject_id: string | null
          subtopic_id: string | null
          topic_id: string | null
          total_marks: number
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by: string
          deleted_at?: string | null
          difficulty: string
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          parent_question_id?: string | null
          part_label?: string | null
          part_order?: number | null
          question_type: string
          subject_id?: string | null
          subtopic_id?: string | null
          topic_id?: string | null
          total_marks?: number
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          difficulty?: string
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          is_approved?: boolean | null
          parent_question_id?: string | null
          part_label?: string | null
          part_order?: number | null
          question_type?: string
          subject_id?: string | null
          subtopic_id?: string | null
          topic_id?: string | null
          total_marks?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_parent_question_id_fkey"
            columns: ["parent_question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subtopic_id_fkey"
            columns: ["subtopic_id"]
            isOneToOne: false
            referencedRelation: "subtopics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      student_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          student_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          student_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_badges_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          created_at: string | null
          id: string
          level: number | null
          school_name: string | null
          streak_current: number | null
          streak_last_date: string | null
          streak_longest: number | null
          updated_at: string | null
          xp_total: number | null
          year_group_label: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          level?: number | null
          school_name?: string | null
          streak_current?: number | null
          streak_last_date?: string | null
          streak_longest?: number | null
          updated_at?: string | null
          xp_total?: number | null
          year_group_label?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number | null
          school_name?: string | null
          streak_current?: number | null
          streak_last_date?: string | null
          streak_longest?: number | null
          updated_at?: string | null
          xp_total?: number | null
          year_group_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          display_order: number | null
          exam_board_id: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          exam_board_id: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          exam_board_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_exam_board_id_fkey"
            columns: ["exam_board_id"]
            isOneToOne: false
            referencedRelation: "exam_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_ends_at: string | null
          grace_period_ends_at: string | null
          id: string
          plan: string
          role: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_ends_at?: string | null
          grace_period_ends_at?: string | null
          id?: string
          plan: string
          role: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_ends_at?: string | null
          grace_period_ends_at?: string | null
          id?: string
          plan?: string
          role?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subtopics: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          topic_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          topic_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          topic_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subtopics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          subjects_taught: string[] | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id: string
          subjects_taught?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          subjects_taught?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_questions: {
        Row: {
          content: Json
          created_at: string | null
          deleted_at: string | null
          difficulty: string
          id: string
          image_url: string | null
          question_type: string
          subject_tag: string | null
          teacher_id: string
          topic_tag: string | null
          total_marks: number
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          deleted_at?: string | null
          difficulty: string
          id?: string
          image_url?: string | null
          question_type: string
          subject_tag?: string | null
          teacher_id: string
          topic_tag?: string | null
          total_marks?: number
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          deleted_at?: string | null
          difficulty?: string
          id?: string
          image_url?: string | null
          question_type?: string
          subject_tag?: string | null
          teacher_id?: string
          topic_tag?: string | null
          total_marks?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_questions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_conversations: {
        Row: {
          course_id: string | null
          created_at: string | null
          exam_attempt_id: string | null
          id: string
          mode: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          exam_attempt_id?: string | null
          id?: string
          mode: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          exam_attempt_id?: string | null
          id?: string
          mode?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutor_conversations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_conversations_exam_attempt_id_fkey"
            columns: ["exam_attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_conversations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "tutor_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          reason: string
          reference_id: string | null
          student_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          reason: string
          reference_id?: string | null
          student_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          reason?: string
          reference_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_exam: { Args: { e_id: string }; Returns: boolean }
      can_read_question: { Args: { q_id: string }; Returns: boolean }
      get_user_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_enrolled_in_course: { Args: { course_uuid: string }; Returns: boolean }
      is_student_in_class: { Args: { class_uuid: string }; Returns: boolean }
      is_teacher_of_class: { Args: { class_uuid: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
