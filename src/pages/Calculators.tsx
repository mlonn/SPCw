import { Box, Button, Heading } from "grommet";
import React, { Fragment } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import calculators from "../resources/calculators";
import { CALCULATION_TYPE } from "../types";
import Calculator from "./Calculator";

interface Props {}

const Calculators = (props: Props) => {
  let match = useRouteMatch();
  const cpCalculators = calculators.filter((c) => c.active && c.type === CALCULATION_TYPE.FTP_CP);
  const planningCalculators = calculators.filter((c) => c.active && c.type === CALCULATION_TYPE.RACE_POWER_PLANNING);
  return (
    <>
      <Switch>
        <Route path={`${match.path}/:calculatorId`}>
          <Calculator />
        </Route>
        <Route path={match.path}>
          <Box alignSelf="center" width="xlarge">
            <Heading>Calculators</Heading>
            {cpCalculators.length > 0 && (
              <Fragment>
                <Heading level="2" size="small">
                  {CALCULATION_TYPE.FTP_CP}
                </Heading>
                <ul>
                  {cpCalculators.map((c) => (
                    <li key={c.id}>
                      <Link to={`/calculators/${c.id}`}>
                        <Button plain label={c.title} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Fragment>
            )}
            {planningCalculators.length > 0 && (
              <Fragment>
                <Heading level="2" size="small">
                  {CALCULATION_TYPE.RACE_POWER_PLANNING}
                </Heading>
                <ul>
                  {planningCalculators.map((c) => (
                    <li key={c.id}>
                      <Link to={`/calculators/${c.id}`}>
                        <Button plain label={c.title} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Fragment>
            )}
          </Box>
        </Route>
      </Switch>
    </>
  );
};

export default Calculators;
