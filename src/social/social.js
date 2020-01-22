/**
 * Core logic for social encounters
 *
 * @module swrpg/social/core
 *
 * @author Draico Dorath
 * @copyright 2020
 * @license MIT
 */

import {Dice, Macros} from "../util/enums";
import {sendPrivate} from "../util/chat";

/* Sender of chat messages */
const SpeakingAs = "C-4D4";

const charm = () => {
    let content = {
        title: "Charm (Presence)",
        subtitle: "Opposed by: Cool",
        flavor: "Increase Difficulty when desired outcome is directly opposed to target's interests",
        wide: "Charming a crowd has a fixed difficulty instead of being opposed",
        wide2: `Extra ${Dice.Success(1)} extends support for additional scenes
            ${Dice.Advantage(1)} affects unexpected subjects beyond target
            ${Dice.Triumph(1)} may be used to have target become minor recurring ally`,
        wide4: `${Dice.Threat(1)} reduces the number of affected people
            ${Dice.Despair(1)} turns the NPC into a minor recurring adversary`
    };
    sendPrivate(SpeakingAs, content);
};

const coercion = () => {
    let content = {
        title: "Coercion (Willpower)",
        subtitle: "Opposed by: Discipline",
        flavor: "Increase Difficulty when desired outcome is directly opposed to target's interests",
        wide: "Intimidating a crowd has a fixed difficulty instead of being opposed",
        wide2: `${Dice.Success(2)} inflicts 1 strain on the target
            ${Dice.Advantage(2)} affects unexpected subjects beyond target
            ${Dice.Triumph(1)} may be used to have target become subjugated, if flighty`,
        wide3: `${Dice.Threat(1)} builds resentment towards coercer
            ${Dice.Despair(1)} reveals too much information to target`
    };
    sendPrivate(SpeakingAs, content);
};

const deception = () => {
    let content = {
        title: "Deception (Cunning)",
        subtitle: "Opposed by: Discipline",
        flavor: "Increase Difficulty when desired outcome is directly opposed to target's interests",
        wide: `Extra ${Dice.Success(1)} extends the life of the lie
            ${Dice.Advantage(1)} increases the value of goods/services provided
            ${Dice.Triumph(1)} fools target into believing the liar is trustworthy`,
        wide2: `${Dice.Threat(1)} increases suspicion
            ${Dice.Despair(1)} increases hostility and harms reputation`
    };
    sendPrivate(SpeakingAs, content);
};

const leadership = () => {
    let content = {
        title: "Leadership (Presence)",
        subtitle: "Opposed by: Discipline",
        flavor: "Modify Difficulty based on complexity of orders and intelligence/professionalism of targets",
        wide: `Extra ${Dice.Success(1)} extends duration of obedience or increases target effectiveness
            ${Dice.Advantage(1)} affects bystanders as well
            ${Dice.Triumph(1)} may be used to have target become minor recurring ally`,
        wide2: `${Dice.Threat(1)} decreases effectiveness of targets
            ${Dice.Despair(1)} undermines authority`
    };
    sendPrivate(SpeakingAs, content);
};

const negotation = () => {
    let content = {
        title: "Negotiation (Presence)",
        subtitle: "Opposed by: Cool or Negotiation",
        wide: `Extra ${Dice.Success(1)} increases acting character's profit by 5% each or improves scope of agreement
            ${Dice.Advantage(1)} grants concessions on a failed check or extra perks on success
            ${Dice.Triumph(1)} target may become regular client or specialist vendor, may offer specific goods or referrals`,
        wide2: `${Dice.Threat(1)} decreases acting character's profit by 5% each or reduces scope of deal
            ${Dice.Despair(1)} seriously sabotages deal or relationship`
    };
    sendPrivate(SpeakingAs, content);
};

const display = () => {
    let content = {
        title: "Social Encounter",
        flavor: `Prior relationship may add ${Dice.Boost(1)} / ${Dice.Setback(1)} as appropriate`,
        wide: `${Macros.socialCharm} ${Macros.socialCoercion}`,
        wide2: `${Macros.socialDeception} ${Macros.socialLeadership}`,
        wide3: Macros.socialNegotiation
    };
    sendPrivate(SpeakingAs, content);
};

export {
    charm,
    coercion,
    deception,
    display as main,
    leadership,
    negotation
}
