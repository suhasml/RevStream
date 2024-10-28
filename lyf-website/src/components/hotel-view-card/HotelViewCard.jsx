import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from 'utils/price-helpers';

/**
 * HotelViewCard Component
 * Renders a card view for a hotel, displaying its image, title, subtitle, benefits, price, and ratings.
 * Provides a 'Book now' button to navigate to the hotel's detailed view.
 *
 * @param {Object} props - Props for the component.
 * @param {string} props.id - The unique code of the hotel.
 * @param {Object} props.image - The image object for the hotel, containing the URL and alt text.
 * @param {string} props.title - The title of the hotel.
 * @param {string} props.subtitle - The subtitle or a short description of the hotel.
 * @param {Array} props.benefits - A list of benefits or features offered by the hotel.
 * @param {string} props.price - The price information for the hotel.
 * @param {number} props.ratings - The ratings of the hotel.
 */
const HotelViewCard = (props) => {
  const {
    id: hotelCode,
    image,
    title,
    subtitle,
    benefits,
    price,
    ratings,
  } = props;
  const navigate = useNavigate();
  
  const onBookNowClick = () => {
    navigate(`/hotel/${hotelCode}`);
  };

  return (
    <div
      className="card border p-6 flex flex-col md:flex-row gap-x-4 w-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
      data-testid="hotel-view-card"
    >
      <div className="cursor-pointer">
        <Link
          to={`/hotel/${hotelCode}`}
          className="block text-slate-700 hover:text-brand transition-colors duration-300"
        >
          <img
            src={image.imageUrl}
            alt={image.accessibleText}
            className="md:w-[240px] md:h-[160px] object-cover rounded-md"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-between ml-0 md:ml-4 flex-1">
        <div>
          <Link
            to={`/hotel/${hotelCode}`}
            className="block text-slate-700 hover:text-brand transition-colors duration-300"
          >
            <h4 className="text-2xl font-bold text-slate-800 mb-1">{title}</h4>
          </Link>
          <p className="text-slate-600 text-base mb-2">{subtitle}</p>
        </div>
        <ul className="list-disc pl-5">
          {benefits.length > 0 &&
            benefits.map((benefit, index) => (
              <li className="text-green-800 font-medium text-sm mb-1" key={index}>
                <FontAwesomeIcon icon={faCheck} className="mr-1" /> {benefit}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex flex-col ml-0 md:ml-auto justify-between border-l-0 md:border-l-2 items-stretch pl-0 md:pl-4 pt-4">
        <div className="flex justify-between items-center w-full mb-4">
          <h4 className="font-medium text-sm text-white bg-brand p-2 rounded-md">
            {ratings} <FontAwesomeIcon icon={faStar} />
          </h4>
          <p className="text-slate-600 font-bold text-lg">
            ₹ {formatPrice(price)}
          </p>
        </div>
        <button
          className="bg-brand-secondary px-4 py-2 text-white rounded-md transition-transform duration-200 hover:scale-105"
          onClick={onBookNowClick}
        >
          Book now
        </button>
      </div>
    </div>
  );
};

export default HotelViewCard;
