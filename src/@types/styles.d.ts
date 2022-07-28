// importamos styled para não ser sobrescrito, e sim adicionado valor a ele
import "styled-components";

import { defaultTheme } from "../styles/themes/default";

type ThemeType = typeof defaultTheme;

declare module "styled-components" {
  //chamamos a interface DefaultTheme e adicionamos o nosso tema "defaultTheme"
  export interface DefaultTheme extends ThemeType {}
}

// com isso, o intelissense vai identificar as variáveis/chaves dentro do tema ao ser utilizado
