import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CountDownContainer, Separator } from "./styles";
import { CyclesContext } from "../../../../contexts/CiclesContext";

export const Countdown = () => {
  const {
    activeCycle,
    actualCycleId,
    amountSeconds,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;

    if (activeCycle) {
      interval = setInterval(() => {
        const diff = differenceInSeconds(new Date(), activeCycle.startDate);

        if (diff >= totalSeconds) {
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(diff);
        }
      }, 1000);
    }

    // quando o useEffect ser executado de novo por causa de uma alteração no estado
    // esse return vai "resetar" os dados e resolver o bug de interpolar os valores anteriores
    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    totalSeconds,
    actualCycleId,
    setSecondsPassed,
    markCurrentCycleAsFinished,
  ]);

  // aqui convertemos os minutos inseridos no input por segundos
  const currentSeconds = activeCycle ? totalSeconds - amountSeconds : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  // padStart - função
  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  );
};
