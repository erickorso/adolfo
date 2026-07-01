"use client";

import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useState } from "react";
import type { QuizOption } from "@/domain/learning/ai-agents/quizzes/quiz.types";
import {
  isSameOrder,
  parseOrder,
  serializeOrder,
} from "@/domain/learning/ai-agents/quizzes/order-answer";
import { lessonLocalizedText } from "@/domain/learning/ai-agents/lesson.types";
import { cn } from "@/lib/utils";

type QuizDragOrderProps = {
  items: QuizOption[];
  locale: string;
  value: string;
  onChange: (serialized: string) => void;
  disabled?: boolean;
  correctOrder?: string[];
  showFeedback?: boolean;
  hint?: string;
};

export function QuizDragOrder({
  items,
  locale,
  value,
  onChange,
  disabled = false,
  correctOrder,
  showFeedback = false,
  hint,
}: QuizDragOrderProps) {
  const orderedIds = parseOrder(value);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const itemMap = new Map(items.map((item) => [item.id, item]));

  function emit(ids: string[]) {
    onChange(serializeOrder(ids));
  }

  function moveItem(from: number, to: number) {
    if (disabled || to < 0 || to >= orderedIds.length || from === to) {
      return;
    }

    const next = [...orderedIds];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed!);
    emit(next);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex == null || disabled) {
      return;
    }

    moveItem(dragIndex, targetIndex);
    setDragIndex(null);
    setOverIndex(null);
  }

  const listLabel = hint ?? "Order blocks";

  return (
    <div className="flex flex-col gap-3">
      {hint ? <p className="learn-drag__hint">{hint}</p> : null}
      <ol className="learn-drag__list" aria-label={listLabel}>
        {orderedIds.map((id, index) => {
          const item = itemMap.get(id);
          if (!item) {
            return null;
          }

          const label = lessonLocalizedText(locale, item.label);
          const stepClass = `learn-drag__item--step-${Math.min(index + 1, 4)}`;
          const isItemCorrect =
            showFeedback &&
            correctOrder &&
            isSameOrder(orderedIds, correctOrder);

          return (
            <li
              key={id}
              draggable={!disabled}
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setOverIndex(index);
              }}
              onDrop={(event) => {
                event.preventDefault();
                handleDrop(index);
              }}
              className={cn(
                "learn-drag__item",
                stepClass,
                dragIndex === index && "learn-drag__item--dragging",
                overIndex === index && dragIndex !== index && "learn-drag__item--over",
                showFeedback &&
                  correctOrder &&
                  (isItemCorrect
                    ? "learn-drag__item--correct"
                    : "learn-drag__item--wrong"),
              )}
            >
              <span className="learn-drag__index" aria-hidden>
                {index + 1}
              </span>
              <GripVertical className="learn-drag__grip size-4" aria-hidden />
              <span className="learn-drag__label">{label}</span>
              <div className="learn-drag__actions">
                <button
                  type="button"
                  className="learn-drag__move-btn"
                  disabled={disabled || index === 0}
                  aria-label={`Move up item ${index + 1}`}
                  onClick={() => moveItem(index, index - 1)}
                >
                  <ChevronUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className="learn-drag__move-btn"
                  disabled={disabled || index === orderedIds.length - 1}
                  aria-label={`Move down item ${index + 1}`}
                  onClick={() => moveItem(index, index + 1)}
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
