import React from "react";
import ProblemStatementCloth from "./ProblemStatementCloth.jsx";

export default function ClothParagraph({ children, text, className = "", style, ...rest }) {
  const content = typeof text === "string" ? text : typeof children === "string" ? children : null;

  if (content === null) {
    return (
      <p className={className} style={style} {...rest}>
        {children}
      </p>
    );
  }

  return (
    <ProblemStatementCloth
      text={content}
      className={className}
      variant="inline"
      minHeight={0}
      padding={0}
      style={style}
      as="p"
      {...rest}
    />
  );
}
