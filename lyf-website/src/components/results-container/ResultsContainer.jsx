import HotelViewCard from 'components/hotel-view-card/HotelViewCard';
import VerticalFilters from 'components/vertical-filters/VerticalFilters';
import HotelViewCardSkeleton from 'components/hotel-view-card-skeleton/HotelViewCardSkeleton';
import VerticalFiltersSkeleton from 'components/vertical-filters-skeleton/VerticalFiltersSkeleton';
import EmptyHotelsState from 'components/empty-hotels-state/EmptyHotelsState';
import { useRef, useState } from 'react';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

/**
 * ResultsContainer Component
 * Renders a container that displays hotel results, including hotel cards and filters.
 * It supports toggling of vertical filters and displays skeletons or empty states based on loading or data availability.
 *
 * @param {Object} props - Props for the component.
 * @param {Object} props.hotelsResults - Object containing hotel results data and loading state.
 * @param {boolean} props.enableFilters - Flag to enable or disable the filter feature.
 * @param {Array} props.filtersData - Array of filter data objects for the vertical filters.
 * @param {Array} props.selectedFiltersState - Array of selected filter states.
 * @param {Function} props.onFiltersUpdate - Callback function to handle filter updates.
 * @param {Function} props.onClearFiltersAction - Callback function to handle the action of clearing filters.
 * @param {Array} props.sortingFilterOptions - Array of sorting filter options.
 * @param {Object} props.sortByFilterValue - Object containing the selected sorting filter value.
 * @param {Function} props.onSortingFilterChange - Callback function to handle sorting filter changes.
 */
const ResultsContainer = (props) => {
  const {
    enableFilters,
    filtersData,
    selectedFiltersState,
    onFiltersUpdate,
    onClearFiltersAction,
    sortingFilterOptions,
    sortByFilterValue,
    onSortingFilterChange,
  } = props;

  // Updated hotel data
  const hotelsResults = {
    isLoading: false,
    data: [
      {
        hotelCode: 71224,
        title: "lyf Funan Singapore",
        subtitle: "67 Hill St, Level 4 Funan, Singapore 179370",
        price: "10594",
        images: [{
          "imageUrl": "/images/hotels/481481762/525626081.jpg",
          "accessibleText": "hyatt pune hotel"
        }],
        ratings: 4,
        benefits: []
      },
      {
        hotelCode: 71222,
        title: "lyf one-north Singapore",
        subtitle: "80 Nepal Park, Singapore 139409",
        price: "12304",
        images: [{
          "imageUrl": "/images/hotels/481481762/481481762.jpg",
          "accessibleText": "hyatt pune hotel"
        }],
        ratings: 4,
        benefits: [],
        reviews: {
          data: [
            { reviewerName: "Rahul Patel", rating: 5, review: "The hotel is very good and the staff is very friendly. The food is also very good.", date: "Date of stay: 2021-01-01", verified: true },
            { reviewerName: "Sara Johnson", rating: 4, review: "Great hotel with excellent service. Highly recommended!", date: "Date of stay: 2021-02-15", verified: false },
            { reviewerName: "John Smith", rating: 3, review: "Average hotel. The staff could be more attentive.", date: "Date of stay: 2021-03-10", verified: true },
            { reviewerName: "Emily Davis", rating: 5, review: "Amazing experience! The hotel exceeded my expectations.", date: "Date of stay: 2021-04-20", verified: false },
            { reviewerName: "David Wilson", rating: 1, review: "Terrible experience. The hotel was dirty and the staff was rude.", date: "Date of stay: 2021-05-05", verified: true },
            { reviewerName: "Jessica Thompson", rating: 4, review: "Lovely hotel with a great location.", date: "Date of stay: 2021-06-12", verified: false },
            { reviewerName: "Michael Brown", rating: 2, review: "Disappointing stay. The room was not clean.", date: "Date of stay: 2021-07-20", verified: true },
            { reviewerName: "Sophia Lee", rating: 5, review: "Exceptional service and beautiful rooms.", date: "Date of stay: 2021-08-05", verified: false },
            { reviewerName: "Daniel Johnson", rating: 3, review: "Decent hotel with average facilities.", date: "Date of stay: 2021-09-10", verified: true },
            { reviewerName: "Olivia Wilson", rating: 4, review: "Enjoyed my stay at the hotel. The room was comfortable.", date: "Date of stay: 2021-10-15", verified: false },
            { reviewerName: "Ethan Davis", rating: 4, review: "Fantastic hotel with great amenities.", date: "Date of stay: 2021-11-20", verified: true },
            { reviewerName: "Ava Smith", rating: 2, review: "Not satisfied with the hotel.", date: "Date of stay: 2021-12-05", verified: false },
            { reviewerName: "Mia Johnson", rating: 4, review: "Had a pleasant stay at the hotel.", date: "Date of stay: 2022-01-10", verified: true },
            { reviewerName: "Noah Wilson", rating: 3, review: "Average hotel with decent facilities.", date: "Date of stay: 2022-02-15", verified: false },
            { reviewerName: "Liam Davis", rating: 4, review: "Outstanding hotel with top-notch service.", date: "Date of stay: 2022-03-20", verified: true }
          ]
        }
      },
      {
        hotelCode: 71223,
        title: "lyf Farrer Park Singapore",
        subtitle: "2 Perumal Rd, #01-01, Singapore 218773",
        price: "13634",
        images: [ {
          "imageUrl": "/images/hotels/481481762/525626095.jpg",
          "accessibleText": "hyatt pune hotel"
        }],
        ratings: 4,
        benefits: []
      },
      {
        hotelCode: 71225,
        title: "Citadines Connect City Centre Singapore",
        subtitle: "182 Clemenceau Ave, Singapore 239923",
        price: "10619",
        images: [ {
          "imageUrl": "/images/hotels/481481762/525626104.jpg",
          "accessibleText": "hyatt pune hotel"
        }],
        ratings: 4,
        benefits: []
      },
      {
        hotelCode: 71226,
        title: "Ascott Orchard Singapore",
        subtitle: "No. 11 Cairnhill Rd, Singapore 229724",
        price: "17405",
        images: [{
          "imageUrl": "/images/hotels/481481762/525626212.jpg",
          "accessibleText": "hyatt pune hotel"
        }],
        ratings: 5,
        benefits: []
      },
      {
        hotelCode: 71227,
        title: "Citadines Rochor Singapore",
        subtitle: "2 Serangoon Rd, #03-01 Tekka Place, Singapore 218227",
        price: "12780",
        images: [ {
          "imageUrl": "/images/hotels/465660377/465660377.jpg",
          "accessibleText": "Courtyard by Marriott Pune"
        }],
        ratings: 4,
        benefits: []
      },
      {
        hotelCode: 71228,
        title: "Oakwood Studios Singapore",
        subtitle: "18 Mount Elizabeth, Singapore 228514",
        price: "15891",
        images: [ {
          "imageUrl": "/images/hotels/469186143/469186143.jpg",
          "accessibleText": "The Westin Pune Koregaon Park"
        }],
        ratings: 4,
        benefits: []
      },
      {
        hotelCode: 71229,
        title: "KēSa House by The Unlimited Collection",
        subtitle: "55 Keong Saik Rd., #01-01, Singapore 089158",
        price: "12444",
        images: [{
          "imageUrl": "/images/hotels/252004905/252004905.jpg",
          "accessibleText": "Novotel Pune Viman Nagar Road"
        }],
        ratings: 4,
        benefits: []
      },
      {
        hotelCode: 71230,
        title: "lyf Bugis Singapore",
        subtitle: "200 Middle Rd, Singapore 188980",
        price: "10547",
        images: [{
          "imageUrl": "/images/hotels/54360345/54360345.jpg",
          "accessibleText": "Vivanta Pune"
        }],
        ratings: 4,
        benefits: []
      },
      {
        hotelCode: 71231,
        title: "Ann Siang House by The Unlimited Collection",
        subtitle: "28 Ann Siang Rd, Singapore 069708",
        price: "19921",
        images: [{
          "imageUrl": "/images/hotels/13800549/13800549.jpg",
          "accessibleText": "Taj Lands End"
        }],
        ratings: 4,
        benefits: []
      },
      {
        hotelCode: 71232,
        title: "Wanderlust by The Unlimited Collection",
        subtitle: "2 Dickson Rd, Singapore 209494",
        price: "17095",
        images: [{
          "imageUrl": "/images/hotels/32810889/32810889.jpg",
          "accessibleText": "Trident Nariman Point"
        }],
        ratings: 4,
        benefits: []
      },
    ],
  };

  // Check if sorting filter is visible
  const isSortingFilterVisible =
    sortingFilterOptions && sortingFilterOptions.length > 0;

  const [isVerticalFiltersOpen, setIsVerticalFiltersOpen] = useState(false);

  const wrapperRef = useRef();
  const buttonRef = useRef();

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsVerticalFiltersOpen(false);
    }
  });

  const toggleVerticalFiltersAction = () => {
    setIsVerticalFiltersOpen((prevState) => !prevState);
  };

  return (
    <div className="relative">
      <div className="flex gap-x-0 md:gap-x-4 items-start mx-2">
        {enableFilters && selectedFiltersState.length > 0 && (
          <div ref={wrapperRef}>
            <VerticalFilters
              filtersData={selectedFiltersState}
              onFiltersUpdate={onFiltersUpdate}
              onClearFiltersAction={onClearFiltersAction}
              isVerticalFiltersOpen={isVerticalFiltersOpen}
            />
          </div>
        )}
        {enableFilters && filtersData.isLoading && <VerticalFiltersSkeleton />}
        <div className="flex flex-col w-full items-start">
          <div className="flex w-full justify-between px-2 md:px-0">
            {enableFilters && (
              <div className="vertical-filters__toggle-menu block md:hidden">
                <button
                  ref={buttonRef}
                  data-testid="vertical-filters__toggle-menu"
                  onClick={toggleVerticalFiltersAction}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FontAwesomeIcon icon={faFilter} size="sm" className="mr-1" />{' '}
                  Filters
                </button>
              </div>
            )}
            {isSortingFilterVisible && (
              <Select
                value={sortByFilterValue}
                onChange={onSortingFilterChange}
                options={sortingFilterOptions}
                className="mb-2 w-[180px] text-sm"
              />
            )}
          </div>
          <div className="hotels-results__container mx-2 md:mx-0 flex flex-col gap-y-2 w-full">
            {hotelsResults.isLoading ? (
              Array.from({ length: 5 }, (_, index) => (
                <HotelViewCardSkeleton key={index} />
              ))
            ) : hotelsResults.data.length > 0 ? (
              hotelsResults.data.map((hotel) => (
                <HotelViewCard
                  key={hotel.hotelCode}
                  id={hotel.hotelCode}
                  title={hotel.title}
                  image={hotel.images && hotel.images.length > 0 ? hotel.images[0] : 'default-image.jpg'} // Fallback to a default image
                  subtitle={hotel.subtitle}
                  benefits={hotel.benefits}
                  ratings={hotel.ratings}
                  price={hotel.price}
                />
              ))
            ) : (
              <EmptyHotelsState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;