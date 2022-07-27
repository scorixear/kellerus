import { AutocompleteInteraction } from "discord.js";
import CommandInteractionHandle from "./CommandInteractionHandle";

export default abstract class AutocompleteCommandInteractionHandle extends CommandInteractionHandle {
  public abstract handleAutocomplete(interaction: AutocompleteInteraction): Promise<void>;
}