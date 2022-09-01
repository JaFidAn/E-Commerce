import { InputBaseComponentProps } from "@mui/material";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

interface Props extends InputBaseComponentProps {}

export const StripeInput = forwardRef(function StripeInput(
  { component: Components, ...props }: Props,
  ref: Ref<unknown>
) {
  const elementRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    focus: () => elementRef.current.focus,
  }));

  return (
    <Components
      onReady={(element: any) => (elementRef.current = element)}
      {...props}
    />
  );
});
