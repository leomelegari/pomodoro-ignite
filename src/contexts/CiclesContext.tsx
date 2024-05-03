import { ReactNode, createContext, useState } from "react";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedData?: Date;
}

interface CyclesContextData {
  cycles: ICycle[];
  activeCycle: ICycle | undefined;
  actualCycleId: string | null;
  amountSeconds: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextData);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  // estado para controlar qual ciclo está ativo
  const [actualCycleId, setActualCycleId] = useState<string | null>(null);
  const [amountSeconds, setAmountSeconds] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === actualCycleId);

  const markCurrentCycleAsFinished = () => {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === actualCycleId) {
          return { ...cycle, finishedData: new Date() };
        } else {
          return cycle;
        }
      }),
    );
  };

  const setSecondsPassed = (seconds: number) => {
    setAmountSeconds(seconds);
  };

  const createNewCycle = (data: CreateCycleData) => {
    const newCycle: ICycle = {
      id: crypto.randomUUID(),
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
  };

  const interruptCurrentCycle = () => {
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
      }),
    );
    setActualCycleId(null);
  };
  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        actualCycleId,
        amountSeconds,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
