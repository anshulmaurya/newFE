import { Route } from "wouter";

export function PublicRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}