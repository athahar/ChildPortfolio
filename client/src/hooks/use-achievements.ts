import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Achievement, InsertAchievement, Child, InsertChild } from '@db/schema';

export function useChildren() {
  return useQuery<Child[]>({
    queryKey: ['/api/children'],
  });
}

export function useChildAchievements(childId: number) {
  return useQuery<Achievement[]>({
    queryKey: ['/api/achievements', childId],
    enabled: !!childId,
  });
}

export function useAddChild() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (child: InsertChild) => {
      const response = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(child),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/children'] });
    },
  });
}

export function useAddAchievement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (achievement: InsertAchievement) => {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievement),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/achievements', variables.childId] });
    },
  });
}
