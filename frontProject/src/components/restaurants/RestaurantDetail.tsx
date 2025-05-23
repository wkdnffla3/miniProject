import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Restaurant } from '@/types';
import { addBookmark, removeBookmark } from '@/services/restaurantService';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PlaceIcon from '@mui/icons-material/Place';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsIcon from '@mui/icons-material/Directions';
import EditIcon from '@mui/icons-material/Edit';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onClose: () => void;
  onEdit?: (restaurant: Restaurant) => void;
}

const RestaurantDetail = ({ restaurant, onClose, onEdit }: RestaurantDetailProps) => {
  const [isBookmarked, setIsBookmarked] = useState(restaurant.bookmarked || false);
  const queryClient = useQueryClient();

  // 북마크 추가 뮤테이션
  const addBookmarkMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // 북마크 삭제 뮤테이션
  const removeBookmarkMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // 북마크 토글 핸들러
  const handleToggleBookmark = () => {
    if (isBookmarked) {
      removeBookmarkMutation.mutate(restaurant.id);
    } else {
      addBookmarkMutation.mutate(restaurant.id);
    }
    setIsBookmarked(!isBookmarked);
  };

  // 지도에서 보기 핸들러
  const handleViewOnMap = () => {
    // TODO: 지도 중심 이동 로직
    window.open(
      `https://map.naver.com/p/search/${encodeURIComponent(restaurant.restaurant)}/${restaurant.latitude},${restaurant.longitude}`,
      '_blank'
    );
  };

  // 수정 버튼 핸들러
  const handleEdit = () => {
    if (onEdit) {
      onEdit(restaurant);
    }
    onClose();
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="restaurant-detail-modal"
      className="flex items-center justify-center p-4"
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="relative">
          <div className="h-40 bg-gray-200 dark:bg-gray-700">
            {/* 여기에 이미지가 있다면 표시 */}
          </div>
          <IconButton
            className="absolute top-2 right-2 bg-black bg-opacity-30 text-white hover:bg-black hover:bg-opacity-50"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            className={`absolute top-2 left-2 ${
              isBookmarked
                ? 'text-yellow-500 bg-white bg-opacity-70'
                : 'bg-black bg-opacity-30 text-white'
            } hover:bg-white hover:text-yellow-500 hover:bg-opacity-70`}
            onClick={handleToggleBookmark}
          >
            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <Typography variant="h5" component="h2" className="font-bold text-gray-900 dark:text-white">
              {restaurant.restaurant}
            </Typography>
            <Rating value={restaurant.rate} readOnly precision={0.5} />
          </div>

          <Chip
            label={restaurant.category}
            size="small"
            className="mb-4 bg-primary text-white"
            icon={<RestaurantIcon className="text-white" />}
          />

          <Divider className="my-4" />

          <div className="space-y-4">
            <div className="flex items-start">
              <PlaceIcon className="text-gray-500 mr-2 mt-1" />
              <div>
                <Typography variant="body1" className="text-gray-700 dark:text-gray-300 font-medium">
                  주소
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  {restaurant.address}
                </Typography>
              </div>
            </div>

            <div className="flex items-start">
              <RestaurantIcon className="text-gray-500 mr-2 mt-1" />
              <div>
                <Typography variant="body1" className="text-gray-700 dark:text-gray-300 font-medium">
                  대표 메뉴
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  {restaurant.main_menu || '정보 없음'}
                </Typography>
              </div>
            </div>

            {restaurant.body && (
              <div className="mt-4">
                <Typography variant="body1" className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  메모
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {restaurant.body}
                </Typography>
              </div>
            )}
          </div>

          <Divider className="my-4" />

          {/* 액션 버튼 */}
          <div className="flex justify-between mt-4">
            {onEdit && (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                color="primary"
                onClick={handleEdit}
              >
                수정하기
              </Button>
            )}
            <Button
              startIcon={<DirectionsIcon />}
              variant="contained"
              color="primary"
              onClick={handleViewOnMap}
              className="ml-auto"
            >
              지도에서 보기
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default RestaurantDetail; 