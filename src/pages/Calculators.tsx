import React from "react";
import { Heading, Box, Button } from "grommet";
import { Link, useRouteMatch, Switch, Route } from "react-router-dom";
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
              <li>
                {calculators
                  .filter((c) => c.active)
                  .map((c) => (
                    <Link to={`/calculators/${c.id}`}>
                      <Button plain label={c.title} />
                    </Link>
                  ))}
              </li>
            </ul>
          </Box>
        </Route>
      </Switch>
    </>
  );
};

export default Calculators;
