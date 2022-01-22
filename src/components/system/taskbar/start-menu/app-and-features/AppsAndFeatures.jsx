import "./AppsAndFeatures.css";
import { useState, useEffect, cloneElement } from "react";
import { appConfigurations } from "../../../../../utils/constants/processConfigurations";

const AppsAndFeatures = ({ startProcess, colapseStartMenu }) => {
  const [startsWithLetter, setStartsWithLetter] = useState({});

  useEffect(() => {
    const startingWithTemp = {};

    Object.keys(appConfigurations).forEach(
      (appName) =>
        (startingWithTemp[appName[0]] = startingWithTemp[appName[0]]
          ? [
              ...startingWithTemp[appName[0]],
              { ...appConfigurations[appName], name: appName },
            ]
          : [{ ...appConfigurations[appName], name: appName }])
    );

    setStartsWithLetter(startingWithTemp);
  }, []);

  return (
    <div className='apps-and-features'>
      {Object.keys(startsWithLetter).length &&
        Object.keys(startsWithLetter)
          .sort()
          .map((letter) => (
            <div className='apps-and-features-letter'>
              <div className='flex-center'>{letter}</div>
              {startsWithLetter[letter].map((app) => {
                const openApp = () => {
                  colapseStartMenu();
                  startProcess(app.name);
                };

                return (
                  <div className='start-menu-app' onClick={openApp}>
                    <div className='flex-center app-icon'>
                      {cloneElement(app.icon, {
                        width: "20px",
                        height: "20px",
                        size: "20px",
                      })}
                    </div>
                    <div className='app-name'>{app.name}</div>
                  </div>
                );
              })}
            </div>
          ))}
    </div>
  );
};

export default AppsAndFeatures;
