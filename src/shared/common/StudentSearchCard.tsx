import { Student } from '@src/dtos/student'
import { badgeMaps } from '@src/shared/constants/columns'
import { Plus, Ticket } from 'lucide-react'

const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-pink-500',
]

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]

const getStudentName = (student: Student) =>
  student.student_name || student.name || ''

interface StudentSearchCardProps {
  student: Student
  onAdd: (student: Student) => void
}

const StudentSearchCard = ({ student, onAdd }: StudentSearchCardProps) => {
  const name = getStudentName(student)
  const statusKey = String(student.is_active ?? false) as keyof typeof badgeMaps
  const badge = badgeMaps[statusKey] ?? badgeMaps['undefined']
  const parentName = student.parent?.name || student.parent_name
  const parentPhone = student.parent?.phone_number
  const redemptionCode = student.redemption_code

  return (
    <div className="border border-gray-200 dark:border-dark-800 rounded-xl p-4 flex items-start gap-4 hover:shadow-md hover:border-primary/30 transition-all">
      {/* Avatar */}
      <div
        className={`size-12 rounded-full flex items-center justify-center text-base font-semibold text-white shrink-0 mt-0.5 ${getAvatarColor(name || '?')}`}>
        {(name || '?').charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h6 className="font-semibold text-sm truncate">{name || '—'}</h6>
          <span
            className={`badge inline-flex items-center gap-1 text-xs shrink-0 ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        {/* Academic info */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {(student.class || student.grade) && (
            <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-800 text-gray-500 dark:text-dark-400">
              <i className="ri-book-open-line text-[10px]" />
              Class&nbsp;{student.class || student.grade}
            </span>
          )}
          {student.section && (
            <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-800 text-gray-500 dark:text-dark-400">
              <i className="ri-group-line text-[10px]" />
              Sec&nbsp;{student.section}
            </span>
          )}
          {student.roll_number && (
            <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-800 text-gray-500 dark:text-dark-400">
              <i className="ri-hashtag text-[10px]" />
              Roll&nbsp;{student.roll_number}
            </span>
          )}
          {student.gender && (
            <span
              className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium ${
                student.gender.toLowerCase() === 'female'
                  ? 'bg-pink-50 dark:bg-pink-500/10 text-pink-500'
                  : student.gender.toLowerCase() === 'male'
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500'
                    : 'bg-gray-100 dark:bg-dark-800 text-gray-500 dark:text-dark-400'
              }`}>
              <i
                className={`text-[10px] ${
                  student.gender.toLowerCase() === 'female'
                    ? 'ri-women-line'
                    : student.gender.toLowerCase() === 'male'
                      ? 'ri-men-line'
                      : 'ri-user-line'
                }`}
              />
              {student.gender.charAt(0).toUpperCase() +
                student.gender.slice(1).toLowerCase()}
            </span>
          )}
        </div>

        {/* Parent info */}
        {(parentName || parentPhone) && (
          <div className="flex items-center gap-1.5 flex-wrap border-t border-gray-100 dark:border-dark-800 pt-1.5">
            {parentName && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-dark-400">
                <i className="ri-parent-line text-[10px]" />
                {parentName}
              </span>
            )}
            {parentName && parentPhone && (
              <span className="text-gray-300 dark:text-dark-600 text-xs">·</span>
            )}
            {parentPhone && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-dark-400">
                <i className="ri-phone-line text-[10px]" />
                {parentPhone}
              </span>
            )}
          </div>
        )}

        {/* Redemption code */}
        {redemptionCode?.code && (
          <div className="flex items-center gap-1.5 mt-1.5 border-t border-gray-100 dark:border-dark-800 pt-1.5">
            <Ticket className="size-3.5 text-amber-500 shrink-0" />
            <span className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400 tracking-wide">
              {redemptionCode.code}
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      {!redemptionCode?.code && (
        <button
          className="btn btn-sub-primary btn-sm shrink-0"
          onClick={() => onAdd(student)}>
          <Plus className="size-4" />
        </button>
      )}
    </div>
  )
}

export default StudentSearchCard
