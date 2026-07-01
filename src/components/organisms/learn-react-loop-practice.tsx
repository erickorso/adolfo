"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  REACT_LOOP_ITEMS,
  REACT_LOOP_ORDER,
} from "@/domain/learning/ai-agents/react-loop.constants";
import {
  isSameOrder,
  parseOrder,
  serializeOrder,
  shuffleIds,
} from "@/domain/learning/ai-agents/quizzes/order-answer";
import { QuizDragOrder } from "@/components/molecules/quiz-drag-order";

type LearnReactLoopPracticeProps = {
  locale: string;
};

export function LearnReactLoopPractice({ locale }: LearnReactLoopPracticeProps) {
  const t = useTranslations("aiAgents");
  const initialOrder = useMemo(
    () => serializeOrder(shuffleIds(REACT_LOOP_ORDER, "react-loop-practice")),
    [],
  );
  const [orderValue, setOrderValue] = useState(initialOrder);
  const solved =
    orderValue.length > 0 &&
    isSameOrder(parseOrder(orderValue), REACT_LOOP_ORDER);

  return (
    <section
      className="learn-path__card flex flex-col gap-4 p-6"
      aria-labelledby="react-loop-practice-heading"
    >
      <div className="flex flex-col gap-1">
        <span className="learn-path__hero-badge w-fit">{t("practiceBadge")}</span>
        <h2
          id="react-loop-practice-heading"
          className="learn-path__card-title text-lg font-semibold"
        >
          {t("reactLoopTitle")}
        </h2>
        <p className="learn-path__card-muted text-sm">{t("reactLoopHint")}</p>
      </div>

      <QuizDragOrder
        items={REACT_LOOP_ITEMS}
        locale={locale}
        value={orderValue}
        onChange={setOrderValue}
        hint={t("dragOrderHint")}
      />

      {solved ? (
        <p className="learn-drag__success" role="status">
          {t("reactLoopSuccess")}
        </p>
      ) : null}
    </section>
  );
}
