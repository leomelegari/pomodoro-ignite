import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

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

// Formulários

// Controlled - manter em tempo real o valor inserido no estado do componente
// é a forma padrão, e não errada, de pegar valores do input (aquele esquema de useState, onChange nos inputs, etc)
// O problema deste método é que, quando um componente é atualizado/modificado, todos os componentes serão re-renderizados
// causando uma queda de performance (quando se trata de um projeto muito grande, com muitos componentes)

// Uncontrolled - bibliotecas externas como: react-hook-form

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutes: zod
    .number()
    .min(5, "O ciclo precisa ser de, no mínimo, 5 minutos")
    .max(60, "O ciclo precisa ser de até 60 minutos"),
});

// interface newCycleFormData {
//   task: string;
//   minutes: number;
// }

type NewCycleFormData = zod.infer<typeof newCycleFormSchema>;

export const Home = () => {
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    // defaultValues: {
    //   task: "",
    //   minutes: 0,
    // },
  });

  const onHandleSubmit = (data: NewCycleFormData) => {
    console.log(data);
    reset();
  };

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
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
            {...register("minutes", { valueAsNumber: true })}
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
