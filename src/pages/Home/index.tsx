import { useContext } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as zod from "zod";

import { HandPalm, Play } from "phosphor-react";

import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
import { HomeContainer, StartCountDown, StopCountDown } from "./styles";
import { CyclesContext } from "../../contexts/CiclesContext";

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

export const Home = () => {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch("task");
  const isSubmitDisabled = !task;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountDown type="button" onClick={interruptCurrentCycle}>
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
