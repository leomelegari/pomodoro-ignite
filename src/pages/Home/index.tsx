import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { v4 as uuidv4 } from "uuid";
import { differenceInSeconds } from "date-fns";

import { HandPalm, Play } from "phosphor-react";
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDown,
  StopCountDown,
  TaskInput,
} from "./styles";
import { useEffect, useState } from "react";

// Formulários

// Controlled - manter em tempo real o valor inserido no estado do componente
// é a forma padrão, e não errada, de pegar valores do input (aquele esquema de useState, onChange nos inputs, etc)
// O problema deste método é que, quando um componente é atualizado/modificado, todos os componentes serão re-renderizados
// causando uma queda de performance (quando se trata de um projeto muito grande, com muitos componentes)

// Uncontrolled - bibliotecas externas como: react-hook-form

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "O ciclo precisa ser de, no mínimo, 5 minutos")
    .max(60, "O ciclo precisa ser de até 60 minutos"),
});

// usar typeof quando for fazer referência a um objeto javascript,
// pois é a única forma do typescript entender
type NewCycleFormData = zod.infer<typeof newCycleFormSchema>;

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedData?: Date;
}

export const Home = () => {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  console.log("cycles ", cycles);

  // estado para controlar qual ciclo está ativo
  const [actualCycleId, setActualCycleId] = useState<string | null>(null);

  const [amountSeconds, setAmountSeconds] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
  });
  // percorremos os ciclos e procuramos pelo ciclo ativo, se houver
  const activeCycle = cycles.find((cycle) => cycle.id === actualCycleId);
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (activeCycle) {
      interval = setInterval(() => {
        const diff = differenceInSeconds(new Date(), activeCycle.startDate);

        if (diff >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === actualCycleId) {
                return { ...cycle, finishedData: new Date() };
              } else {
                return cycle;
              }
            })
          );
          setAmountSeconds(totalSeconds);
          clearInterval(interval);
        } else {
          setAmountSeconds(diff);
        }
      }, 1000);
    }

    // quando o useEffect ser executado de novo por causa de uma alteração no estado
    // esse return vai "resetar" os dados e resolver o bug de interpolar os valores anteriores
    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds]);

  const handleCreateCycle = (data: NewCycleFormData) => {
    const newCycle: ICycle = {
      id: uuidv4(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    //  **IMPORTANTE**
    // quando a atualização de um estado depende do valor anterior
    // utilizar essa forma de setar o novo valor
    setCycles((state) => [...state, newCycle]);
    setActualCycleId(newCycle.id);
    setAmountSeconds(0);

    reset();
  };

  const handleStopCycle = () => {
    setCycles((state) =>
      // para alterar um valor de uma chave específica,
      // precisamos percorrer o objeto todo até encontrar qual
      // chave queremos alterar
      state.map((cycle) => {
        // aqui entro no ciclo ativo, comparando os ids
        if (cycle.id === actualCycleId) {
          // aqui setei o valor da chave em específico no ciclo com id correspondente
          return { ...cycle, interruptedDate: new Date() };
        } else {
          // aqui retorno os demais ciclos já inseridos no estado anteriormente, sem alterá-los
          return cycle;
        }
      })
    );
    setActualCycleId(null);
  };

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
  }, [minutes, seconds]);

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register("task")}
          />

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            disabled={!!activeCycle}
            type="number"
            placeholder="00"
            // min={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        {activeCycle ? (
          <StopCountDown type="button" onClick={handleStopCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountDown>
        ) : (
          <StartCountDown disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDown>
        )}
      </form>
    </HomeContainer>
  );
};
