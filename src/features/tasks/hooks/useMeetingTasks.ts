import { useQuery } from "@tanstack/react-query"

import { getTasksByMeetingId } from "@/features/tasks/services/tasks.service"

export function useMeetingTasks(meetingId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", "byMeeting", meetingId],
    queryFn: () => getTasksByMeetingId(meetingId as string),
    enabled: !!meetingId,
  })
}
