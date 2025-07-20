import VipCard from './VipCard';

export default function VipSection() {
    return (
        <section id="vip" className="py-16 bg-gray-900 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-16 text-white">VIP СТАТУС</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 vip-cards">
                    {/* 🟡 SHINOBI VIP */}
                    <VipCard
                        title="SHINOBI"
                        price="50₴"
                        pricePeriod="/місяць"
                        description="Основний статус для початківців"
                        iconClass="fas fa-star"
                        iconBgColor="#FBBF24"              // 🟡 Жовтий фон іконки
                        iconTextColor="#B45309"            // 🟠 Темно-жовта іконка
                        titleColor="#FBBF24"               // 🟡 Жовтий заголовок
                        descriptionColor="#EDE9FE"         // 🟣 Світло-фіолетовий опис
                        priceColor="#ffffff"               // ⚪ Білий текст ціни
                        featureTextColor="#FBBF24"         // 🟡 Жовтий текст фіч
                        featureIconColor="#D97706"         // 🟠 Жовтий чек-іконка
                        cardBgColor="#78350F"              // 🟠 Темно-жовтий градієнт
                        buttonBgColor="#D97706"            // 🟠 Помаранчева кнопка
                        buttonHoverColor="#B45309"         // 🟠 Темніший ховер
                        buttonTextColor="#ffffff"          // ⚪ Білий текст
                        features={[
                            "Banny Hop, макс. скорость 350, кд 10 секунд.",
                            "Выдача гранат при начале раунда.",
                            'Tab Tag "[Shinobi]".',
                            "+700 каждый раунд.",
                            "Выдача брони.",
                            "Выдача дефузов."
                        ]}
                        buttonLink="https://discord.gg/wJYDueQrJk"
                    />


                      {/* 🟣 DEMON VIP */}
                    <div className="flex-1 relative z-10 scale-105 -2xl">
                        <VipCard
                            title="SHINOBI+"
                            price="100₴"
                            pricePeriod="/місяць"
                            description="Максимальні можливості для гри"
                            iconClass="fas fa-crown"
                            iconBgColor="#7C3AED"              // 🟣 Фіолетовий фон
                            iconTextColor="#E0E7FF"            // ⚪ Світло-блакитна іконка
                            titleColor="#C084FC"               // 🟣 Фіолетовий заголовок
                            descriptionColor="#E0E7FF"         // ⚪ Світлий опис
                            priceColor="#FFFFFF"               // ⚪ Білий текст ціни
                            featureTextColor="#E0E7FF"         // ⚪ Світлі фічі
                            featureIconColor="#C084FC"         // 🟣 Іконка фічі
                            cardBgColor="#4C1D95"              // 🟣 Темно-фіолетовий фон
                            buttonBgColor="#7C3AED"            // 🟣 Фіолетова кнопка
                            buttonHoverColor="#6D28D9"         // 🟣 Темніший ховер
                            buttonTextColor="#FFFFFF"          // ⚪ Білий текст
                            features={[
                                "Banny Hop, макс. скорость 450.",
                                "Выдача гранат(3) при начале раунда.",
                                "+1000 каждый раунд.",
                                'Tab Tag "[Shinobi+]".',
                                "Выдача брони и шлема.",
                                "Покупка оружие через чат.",
                                "Выдача дефузов"
                            ]}
                            buttonLink="#"
                        />
                    </div>

                    {/* ⚫ SHADOW VIP */}
                    <VipCard
                        title="SHADOW"
                        price="150₴"
                        pricePeriod="/місяць"
                        description="Преміум доступ до функцій"
                        iconClass="fas fa-user-ninja"
                        iconBgColor="#1F2937"              // ⚫ Темно-сірий фон
                        iconTextColor="#FACC15"            // 🟡 Жовта іконка
                        titleColor="#000000"               // ⚫ Чорний заголовок
                        descriptionColor="#E5E7EB"         // ⚪ Світло-сірий опис
                        priceColor="#FFFFFF"               // ⚪ Білий текст ціни
                        featureTextColor="#D1D5DB"         // ⚪ Світло-сірі фічі
                        featureIconColor="#F59E0B"         // 🟡 Жовті іконки фіч
                        cardBgColor="#0a4dddff"              // ⚫ Темно-сірий фон картки
                        buttonBgColor="#4B5563"            // 🔵 Сіра кнопка
                        buttonHoverColor="#374151"         // 🔵 Темніший ховер
                        buttonTextColor="#FFFFFF"          // ⚪ Білий текст
                        features={[
                            "Banny Hop, макс. скорость 550.",
                            "Выдача гранат(4) при начале раунда.",
                            "+1500 каждый раунд.",
                            'Tab Tag "[Shadow]".',
                            "Выдача брони и шлема.",
                            "Покупка оружие через чат.",
                            "Анти-Флеш.",
                            "Вампиризм.",
                            "Выдача дефузов",
                            "Доп хп(105).",
                        ]}
                        buttonLink="#"
                    />

                  
                </div>
            </div>
        </section>
    );
}
