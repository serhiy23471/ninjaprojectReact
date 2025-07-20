import React from "react";
import RulesSection from "./RulesSection";
import { rulesData } from "../../data/rulesData";

export default function Rules() {
  return (
    <section id="rules" className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2
          className="text-4xl font-bold text-center mb-12"
          style={{ fontFamily: "'Press Start 2P', cursive", letterSpacing: "1px" }}
        >
          ПРАВИЛА СЕРВЕРА
        </h2>

        {rulesData.map((section) => (
          <RulesSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}
