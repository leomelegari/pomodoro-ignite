import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { v4 as uuidv4 } from "uuid";

import { Play } from "phosphor-react";
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDown,
  TaskInput,
} from "./styles";
import { useState } from "react";

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
    .min(5, "O ciclo precisa ser de, no mínimo, 5 minutos")
    .max(60, "O ciclo precisa ser de até 60 minutos"),
});

// usar typeof quando for fazer referência a um objeto javascript,
// pois é a única forma do typescript entender
type NewCycleFormData = zod.infer<typeof newCycleFormSchema>;

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
}

export const Home = () => {
  const [cycles, setCycles] = useState<ICycle[]>([]);

  // estado para controlar qual ciclo está ativo
  const [actualCycle, setActualCycle] = useState<string | null>(null);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
  });

  const handleCreateCycle = (data: NewCycleFormData) => {
    const newCycle: ICycle = {
      id: uuidv4(),
      task: data.task,
      minutesAmount: data.minutesAmount,
    };

    //  **IMPORTANTE**
    // quando a atualização de um estado depende do valor anterior
    // utilizar essa forma de setar o novo valor
    setCycles((state) => [...state, newCycle]);
    setActualCycle(newCycle.id);

    reset();
  };

  // percorremos os ciclos e procuramos pelo ciclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === actualCycle);
  console.log("activeCycle ", activeCycle);

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
            {...register("task")}
          />

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            min={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountDown disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountDown>
      </form>
    </HomeContainer>
  );
};
