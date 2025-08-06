import React from 'react';

export default function VipCard({
  title,
  price,
  pricePeriod,
  description,
  iconClass,
  iconBgColor,
  iconTextColor,
  titleColor,
  descriptionColor,
  priceColor,
  featureTextColor,
  featureIconColor,
  cardBgColor,
  buttonBgColor,
  buttonHoverColor,
  buttonTextColor,
  features,
  buttonLink
}) {
  return (
    <div className="vip-card rounded-lg overflow-hidden shadow-xl transform transition duration-300 hover:scale-105" style={{ backgroundColor: cardBgColor }}>
      <div className="p-6 text-center">
        {/* Іконка */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: iconBgColor }}
        >
          <i className={`${iconClass} text-3xl`} style={{ color: iconTextColor }}></i>
        </div>

        {/* Заголовок */}
        <h3 className="text-2xl font-bold mb-4" style={{ color: titleColor }}>
          {title}
        </h3>

        {/* Опис */}
        <p className="mb-6" style={{ color: descriptionColor }}>
          {description}
        </p>

        {/* Ціна */}
        <div className="text-3xl font-bold mb-6" style={{ color: priceColor }}>
          {price}
          <span className="text-sm text-gray-300">{pricePeriod}</span>
        </div>

        {/* Особливості */}
        {features.length > 0 && (
          <ul className="scrollbar text-left mb-8 space-y-2 max-h-[180px] overflow-y-auto pr-3" style={{ color: featureTextColor }}>
            {features.map((feat, i) => (
              <li key={i} className="flex items-center">
                <i className="fas fa-check-circle mr-2" style={{ color: featureIconColor }}></i> {feat}
              </li>
            ))}
          </ul>
        )}

        {/* Кнопка */}
        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full font-bold py-3 px-4 rounded transition duration-300"
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = buttonHoverColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = buttonBgColor;
          }}
        >
          Купить
        </a>
      </div>
    </div>
  );
}
