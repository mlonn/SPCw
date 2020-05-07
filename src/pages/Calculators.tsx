import { Box, Button, Heading } from "grommet";
import React from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import calculators from "../resources/calculators";
import Calculator from "./Calculator";

interface Props {}

const Calculators = (props: Props) => {
  let match = useRouteMatch();
  return (
    <>
      <Switch>
        <Route path={`${match.path}/:calculatorId`}>
          <Calculator />
        </Route>
        <Route path={match.path}>
          <Box alignSelf="center" width="xlarge">
            <Heading>Calculators</Heading>
            <ul>
              {calculators
                .filter((c) => c.active)
                .map((c) => (
                  <li>
                    <Link key={c.id} to={`/calculators/${c.id}`}>
                      <Button plain label={c.title} />
                    </Link>
                  </li>
                ))}
            </ul>
          </Box>
        </Route>
      </Switch>
    </>
  );
};

export default Calculators;
