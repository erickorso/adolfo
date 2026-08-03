"use client";

import { useEffect, useId, useRef, useState } from "react";
import Matter from "matter-js";
import { cn } from "@/lib/utils";

export type GravityChip = {
  id: string;
  label: string;
};

type GravityPlaygroundProps = {
  chips: GravityChip[];
  ariaLabel: string;
  className?: string;
};

const HEIGHT = 220;

/**
 * 2D gravity sandbox (Matter.js): labeled chips fall, bounce, and can be dragged.
 * If prefers-reduced-motion, renders a static row instead.
 */
export function GravityPlayground({
  chips,
  ariaLabel,
  className,
}: GravityPlaygroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const scene = sceneRef.current;
    const container = containerRef.current;
    if (!scene || !container || chips.length === 0) return;

    const width = container.clientWidth || 640;
    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 1.15, scale: 0.001 },
    });
    const world = engine.world;

    const render = Render.create({
      element: scene,
      engine,
      options: {
        width,
        height: HEIGHT,
        background: "transparent",
        wireframes: false,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      },
    });

    const wallOpts = {
      isStatic: true,
      render: { fillStyle: "transparent", strokeStyle: "transparent" },
    };
    const ground = Bodies.rectangle(width / 2, HEIGHT + 20, width + 80, 40, wallOpts);
    const left = Bodies.rectangle(-20, HEIGHT / 2, 40, HEIGHT + 80, wallOpts);
    const right = Bodies.rectangle(width + 20, HEIGHT / 2, 40, HEIGHT + 80, wallOpts);
    const ceiling = Bodies.rectangle(width / 2, -30, width + 80, 40, wallOpts);

    const palette = [
      "#0f766e",
      "#0369a1",
      "#b45309",
      "#047857",
      "#6d28d9",
      "#be123c",
    ];

    const chipBodies = chips.map((chip, i) => {
      const w = Math.min(120, 28 + chip.label.length * 9);
      const h = 36;
      const x = 40 + ((i * 70) % Math.max(width - 80, 100));
      const y = 20 + (i % 3) * 18;
      return Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: 10 },
        restitution: 0.45,
        friction: 0.35,
        frictionAir: 0.02,
        label: chip.label,
        render: {
          fillStyle: palette[i % palette.length],
          strokeStyle: "rgba(255,255,255,0.25)",
          lineWidth: 1,
        },
      });
    });

    Composite.add(world, [ground, left, right, ceiling, ...chipBodies]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.18,
        render: { visible: false },
      },
    });
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.fillStyle = "#fff";
      for (const body of chipBodies) {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        ctx.fillText(body.label, 0, 0);
        ctx.restore();
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const onResize = () => {
      const nextW = container.clientWidth || width;
      render.canvas.width = nextW;
      render.canvas.height = HEIGHT;
      render.options.width = nextW;
      Matter.Body.setPosition(ground, { x: nextW / 2, y: HEIGHT + 20 });
      Matter.Body.setPosition(right, { x: nextW + 20, y: HEIGHT / 2 });
      Matter.Body.setPosition(ceiling, { x: nextW / 2, y: -30 });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      Runner.stop(runner);
      Render.stop(render);
      Mouse.clearSourceEvents(mouse);
      Composite.clear(world, false);
      Engine.clear(engine);
      if (render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
      }
      render.textures = {};
    };
  }, [chips, reduced]);

  if (reduced) {
    return (
      <div
        className={cn(
          "flex flex-wrap gap-2 rounded-lg border border-border bg-muted/30 p-4",
          className,
        )}
        role="group"
        aria-labelledby={labelId}
        aria-label={ariaLabel}
      >
        <span id={labelId} className="sr-only">
          {ariaLabel}
        </span>
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
          >
            {chip.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-muted/20",
        className,
      )}
      role="img"
      aria-labelledby={labelId}
      aria-label={ariaLabel}
    >
      <span id={labelId} className="sr-only">
        {ariaLabel}
      </span>
      <div ref={sceneRef} className="h-[220px] w-full touch-none" />
    </div>
  );
}
