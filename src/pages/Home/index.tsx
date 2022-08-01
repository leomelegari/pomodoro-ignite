import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { v4 as uuidv4 } from "uuid";

import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountDown, StopCountDown } from "./styles";
import { createContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedData?: Date;
}

interface CyclesContextData {
  activeCycle: ICycle | undefined;
  actualCycleId: string | null;
  amountSeconds: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

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

export const CyclesContext = createContext({} as CyclesContextData);

export const Home = () => {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  // estado para controlar qual ciclo está ativo
  const [actualCycleId, setActualCycleId] = useState<string | null>(null);
  const [amountSeconds, setAmountSeconds] = useState(0);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const activeCycle = cycles.find((cycle) => cycle.id === actualCycleId);

  const markCurrentCycleAsFinished = () => {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === actualCycleId) {
          return { ...cycle, finishedData: new Date() };
        } else {
          return cycle;
        }
      })
    );
  };

  const setSecondsPassed = (seconds: number) => {
    setAmountSeconds(seconds);
  };

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

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            actualCycleId,
            amountSeconds,
            markCurrentCycleAsFinished,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

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
