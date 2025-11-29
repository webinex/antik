export interface TypeConfigurationOverride {}

export interface TypeConfiguration {
  experimentalOptionSource: TypeConfigurationOverride extends { experimentalOptionSource: infer T }
    ? T
    : false;
  optionType: TypeConfigurationOverride extends { optionType: infer T } ? T : Record<string, any>;
}
