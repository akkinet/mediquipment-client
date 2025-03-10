"use client"
import React from "react"
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform
} from "framer-motion"
import { useRef } from "react"
import { cn } from "../../utils/cn"

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}) {
  return (
    <Component
      className={cn(
        "bg-customBlue hover:bg-customPink  relative text-md  h-16 w-64 p-2  overflow-hidden font-montserrat",
        containerClassName
      )}
      style={{
        borderRadius: "2rem"
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {/* <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--customBlue)_80%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder> */}
      </div>

      <div
        className={cn(
          "relative flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`
        }}
      >
        {children}
      </div>
    </Component>
  )
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}) => {
  const pathRef = useRef()
  const progress = useMotionValue(0)

  useAnimationFrame(time => {
    const length = pathRef.current?.getTotalLength()
    if (length) {
      const pxPerMillisecond = length / duration
      progress.set((time * pxPerMillisecond) % length)
    }
  })

  const x = useTransform(
    progress,
    val => pathRef.current?.getPointAtLength(val).x
  )
  const y = useTransform(
    progress,
    val => pathRef.current?.getPointAtLength(val).y
  )

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
