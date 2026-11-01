import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../store/slices/productSlice';
import { addItem } from '../../store/slices/cartSlice';
import { addFavorite, fetchFavorites, removeFavorite } from '../../store/slices/favoriteSlice';
import { StateMessage } from '../../components/ui';
import { theme, formatVnd } from '../../constants/theme';

const ICONS = {
  bag: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJ+SURBVHhe7ZohTB1BEIaRlZVIZGUlEllZiaxEIpE4JBJZWYlEIiuRlcgnK3H/kEkuzfZjXl6u3MzeNfslT5D8dztzb29m/uUdHQ0Gg8FgMBgMajCzE0mXkh7bj5ldm9kn6v8rJN3aASTdm9lHXrtpzOxY0k8muw9Jz5JOeZ9NMm35HZM8hKQXM/vK+22OaUszuZ3XATM784+kC0lPkc7MPvCem8G/wSApL3hv3nFPNKoRkm6o3QRTQn9tfa8D1BE+hOlV2F53kPQlSOQzdSR6cGZ2Rd3q8aDbDCR9p2YfU31or/1BzerxoJHEJTX78BaIa5+oWT2s6nP6uhfJ9lqHmq54UWKAK6B2ZuDqK+BggV0UH1cZQWfezBapTAPNKpD0m/GlI+kOQVxQk0XQJQ4OWIsT9PmykVXSOdaunxOCIO6pyWI6PGnXLnv4fwi2Ydmw4lNlu7aZfaMmHT/kaCOoLERBAT6jpgRPGoGUtKLALJ1QU8J7xt1/xd0i1nyhpgye9nhhpGZpOIZL+kVNGTy8qPDtwTnDAzVl+PCDYO6oWZrgrCB9zb0E38YjNUvDXTfnnGFxgvfxmZqlYd0pt8EtrMgONUvDzlNug0nQk1NPcKfD1Za+/zfgVOZ1gZqlCKbPHTXlcC7PtMWB/6i3waTSmQUOtN4GkyCoNFvMh+1/U1NOsC3TbDFfty42mASFKc0Ws+B2s8EkaE0ptjhoucfUdMEdWRtVhi3m0NXVBhOOpxm2OBi7+9lgQoOSYYsD45XWbWZTYVGDNW6p6QZ/CpNhi7nLutpgwveziH42mLBCF5HqOmcT9Ohs+tpgMueXoO9lFTZ4MBgMBoPBYLBxXgEQ1+kIoeKhDgAAAABJRU5ErkJggg==',
  heartOutline: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALhSURBVHhe7ZktcBtBDIUDC0ts6UyusLCwMLCwsDDQsLCwzLCwMNDQsNDQMLAw0NAwMJmXWXvUV93/rzP6ZnY89mnv9nalp1355iYIgiAIgiAIgiAIOrNYLDTLsu8i8lNV96q6xfflcvmZbcsQkdt0n9+qusOniHxgu9mQZdlHVb0XkSdVfS5oe9hx3zN5nr9T1Y2qHp2+54bJuOW+k5JWmwfqtjRBG7ysvQc8RET+sn1J29n+k5Fl2VdncGiPWPESj3jI8/w97iEid871SyuaGBH5weMZleT2JxoYXvqbtUur+4dfIGnE2vkdIbC24YJ7QE8c2y/2WaOSXsAO5hfbWJK3lMU32vbsGR6OtxzZZhQQw+Tee7bxKPCac7tne4+UGS79VqvVJ7YZHCixHQRWhm2KwIAdbdiyXRHob/siXbLN4LDyN83RWG3T/1jm9h7kReNnBBKkxnEI8TKT1zivk6g+8vXBgeCZF3ji61WkTc8J8czX6qCqBzMBtfSnVxB3ZgDP2AKzTRUII94Q1YWySS3x7BXeAI2txPbZmEi+PjhTKnGXDNQb5xg2A3lgm6GgDILJLzxgDcoUGxKkS9pDHNhmNDgM2ip6E5yzw5ptRgWubwZzaqvqdbHpD54w9PMq4XQ45BGVM88k6Y9B/rc5GavSdFtchyS6qDFcJmAMzamFc0TtfW+eSmX2GaVH79Hh2gDclW3agjRHyo/D07SxzzhH3GOb7TGTXP+fyeWK02xw3BR1v04rxWUwnALZZjZ4QtVFD5wJxemxd4HtFQzQKXk1FiwW1hRe0xVAm4DDilPyqr1j69p/FvAKpla5ggVF0w3bXQUcw2mTVKjg6WzBL1+7WDpLWMXRvNoBvMNx+0PXLDI5KTP8NwlWGAvCZd+0UjxrbBHVNEwMp7rX369+5T2cs7zXGqfMqwJnBCfWX5unDW8SVvuq7PAmSTvGXfo7vfE/Q0EQBEEQBEEQBEHQnhdpx/hoVDRATgAAAABJRU5ErkJggg==',
  heartFill: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAISSURBVHhe7ZmtU8NAEMWRSCQuFd0NU4VEIpGVSP4EJBKHRCKRyEpkJTKy0KQTiUQiYfYmYdq9a9M0zeVS3m/mudzl3eduNkdHAAAAAAAAAAAAAA35IDpfMD9nzD9GRHnK/JIyX+ln15GPRqdz5tuMaJIxJ9KP6SOOL/WzwfDOfJYxv/0N3CWi1zyOB7ptSR5FxxnRg9VutY/ZfDi80G07JY+iE1lpy6xDKfN3RnRj9RHHAxmcft6llPlr00R6R1ZWm6wU0XXZvhj8VhO4pER2zKqTDpBz6TBXKdkJ0tZs+6qjs06OneSdlOjeMra9kibt5bLVfrxT3NSWOU9KtB/v7HB29yrtxztlnO5CEg20H+/8+yOwIHp0GPMjoon24505851lzJNk8rUf70jero35UjAp8U6ZYFMRzbSPzpC01jLYsuToaR+dIemshCRtsk3J0dM+OsVrNAjh9teYXUD0aZnds+QjKrjVL0mZx9rwviWVIv3eoGg5IoRRA9iEFDdM1cc231jBxP0q2sgOF8xP+j1BI1VcPYgGmga/9TVFqWvqGEw9Ec2k6Kr77wV1qsUuBVf93YXiUqydJcpF2ptLrwqp/taODEtl84NAVnObnWDK5cxj3f4gML/PNtwJMkEHs+3XURRQ7EIqUS4TpJ8/SIrosJwyJ8F+4LSF5AnmN7r8Me5rnAcAAAAAAAAAAEAv+QUTCha4TQqpYAAAAABJRU5ErkJggg==',
  checkCircle: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAO8SURBVHhe7Zo/aBRBFMZTWqa00yo7SRMbwcJCsLFMFzMrXpqAaBOs1CYpRFHMbmEwGBALhRNETwIaRCFqYYgpNIWeoBBBMRAL/2BITGJG3mRPLt/s3m52ZvYuMD/4INzO3fve7OzMm8m2tTkcDofD4XA4HFa5XOraHXDvROh7w4HPbgacTdUr9L0yXQt9Nhj2envx+zsSSoQS2kyQie0o8NnrwGdnrvR1MPzdlofuduizMUwqv7zyjhgVYam7PeTexZCzZTUJfQW8M6TOxbgtAQ3V0GdVNG1c3FsY8dkBjN9URo51HAk4+66YtSUaYdzrRx9NgYwoBguTN4x+CoXuvGqqWNHSir4KgZ75Qod9kuSE6x1Cf1ah2T7w2bxipkmSN6LIZZKWIzTRbAU+q6BPK8gix9I6ry3etQ/9GofqeCVwARo/eVDMPS2L9y8fitvnepTrUpxNol+jRMWOGtiybgweFj8Xv4gai5+qSpuaaGVC38aIdmtKUJvC5InfP74p7WqiEYq+jRFybxoD2tS1gf3ybiOvJsaVtv/FvQX0bYRoa6sGtKSk5N8+v6+0VWWhLpAHFUogO7ra3y3m515g7nICxLZxomUa/Wtjdn+frKTk6TO6hu1jZWM1oEJDCWRBdJeRz+9msicfnSahf22KmADp+UZoHqD5ANs2lI2JMK32p0KFEqA7eGeoV7meJprZkVzJR0L/2lCvYpB61Q/dtdUVUbk0oLRJ0vS90S2JE7T2Uw2AbbMK/WtDzxUGqdfXD2+2JJC1E57durDle4Ru8rQ7RP/a0MyKgepFySJpnfD4+ln8ilhZ+pVc62dXFf1rk2UTFJdQUidMBKewqankaQRMoX9t6J8UGChOWTqB/qbPsM3d88eV38upMfSvDR1FxwSKVaNOoCTjko8bJXk10seOon8jpC2F9YrrhPW1P2J1ZQk/Fo9GTyvfzy3OlodKe3ahdyNs9ygsrhMQaoPf05HVozHaZWHANDXqBFoCsb22bP/DJE9JHNcJMw/GlHYGVLU2/GvQwWNM4FTNToyLjb/rQmxsiI+zT5TrRtTX2YN+raCzM8xb26fJyg4wCXk42nJH4xZOgRpBw0010TQNor9CyFodWpb5qm87ZNkjWBNnk9Zn/SzI12LQnGVRx7dE8jWo/i5wYmzOM5+GrBFyFEpZtXkoU/Bsn4dohTD2wpTchNkucW1ApmXRlPfR4GySXoFpqWc9D5SAnCN8ryxfjY3bVnNvIbpWkS9elbrb8XccDofD4XA4HA5z/APdvJOsHXUn4AAAAABJRU5ErkJggg==',
};

function getInitials(name) {
  if (!name) return 'KH';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts.length > 1 ? parts[parts.length - 2][0] : parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Gần đây';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMonth > 0) return `${diffMonth} tháng trước`;
  if (diffWeek > 0) return `${diffWeek} tuần trước`;
  if (diffDay > 0) return `${diffDay} ngày trước`;
  if (diffHour > 0) return `${diffHour} giờ trước`;
  if (diffMin > 0) return `${diffMin} phút trước`;
  return 'Vừa xong';
}

function renderStars(rating, max = 5, size = 12) {
  const num = Math.min(max, Math.max(0, Math.round(Number(rating) || 0)));
  const stars = [];
  for (let i = 1; i <= max; i++) {
    stars.push(
      <Text
        key={i}
        style={{
          fontSize: size,
          color: i <= num ? '#b8944d' : '#dedad2',
          marginRight: 2,
          lineHeight: size + 2
        }}
      >
        ★
      </Text>
    );
  }
  return <View style={styles.starsRow}>{stars}</View>;
}

export default function ProductScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const result = useSelector(state => state.products.current);
  const detailStatus = useSelector(state => state.products.detailStatus);
  const detailError = useSelector(state => state.products.detailError);
  const user = useSelector(state => state.auth.user);
  const favorites = useSelector(state => state.favorites.items);

  const [variantId, setVariantId] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    dispatch(fetchProduct(route.params.id));
    if (user) dispatch(fetchFavorites());
  }, [dispatch, route.params.id, user?._id]);

  const product = result?.product;
  const reviews = result?.reviews || [];

  const variant = useMemo(
    () =>
      product?.variants.find(entry => entry._id === variantId) ||
      product?.variants.find(entry => entry.isActive && entry.quantity > 0),
    [product, variantId]
  );

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.paper} />
        <StateMessage
          title={detailStatus === 'failed' ? 'Không thể tải sản phẩm' : 'Đang tải sản phẩm'}
          message={detailError}
          loading={detailStatus !== 'failed'}
          action={detailStatus === 'failed' ? 'Thử lại' : undefined}
          onAction={() => dispatch(fetchProduct(route.params.id))}
        />
      </View>
    );
  }

  const favorite = favorites.some(item => item.product?._id === product._id);

  const selectVariant = entry => {
    setVariantId(entry._id);
    setNotice('');
  };

  const addToBag = () => {
    if (!variant || variant.quantity < 1) {
      return setNotice('Biến thể này đã hết hàng.');
    }
    dispatch(
      addItem({
        productId: product._id,
        variantId: variant._id,
        name: product.name,
        price: product.price,
        size: variant.size,
        color: variant.color,
        image: variant.images?.[0] || product.images?.[0],
        key: `${product._id}:${variant._id}`
      })
    );
    setNotice('Đã thêm vào túi đồ thành công!');
    setTimeout(() => setNotice(''), 3000);
  };

  const toggleFavorite = () => {
    if (!user) return navigation.navigate('Auth');
    dispatch(favorite ? removeFavorite(product._id) : addFavorite(product._id));
  };


  const reviewCount = reviews.length;
  const avgRatingNum =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviewCount
      : 0;
  const avgRatingText = reviewCount > 0 ? avgRatingNum.toFixed(1) : '0.0';


  const categoryName = (product.category?.name || 'PHỤ KIỆN').toUpperCase();
  const productTag = product.tags?.[0] || 'MỚI VỀ';
  const displayImage = variant?.images?.[0] || product.images?.[0];

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.paper} />


      <View style={styles.headerAnchorBorder} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.heroImageBox}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>{productTag}</Text>
          </View>
          {displayImage ? (
            <Image
              source={{ uri: displayImage }}
              resizeMode="cover"
              style={styles.productImage}
            />
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Text style={styles.noImageText}>FITZY · STUDIO</Text>
            </View>
          )}
        </View>


        <View style={styles.infoCard}>

          <View style={styles.metaRow}>
            <Text style={styles.categoryText}>{categoryName}</Text>
            <View style={styles.ratingSummaryRow}>
              {reviewCount > 0 ? (
                <>
                  <Text style={styles.starIcon}>★</Text>
                  <Text style={styles.ratingNumberText}>{avgRatingText}</Text>
                  <Text style={styles.ratingCountText}>({reviewCount} đánh giá)</Text>
                </>
              ) : (
                <Text style={styles.ratingCountText}>Chưa có đánh giá</Text>
              )}
            </View>
          </View>


          <Text style={styles.productName}>{product.name}</Text>


          <View style={styles.priceRow}>
            <Text style={styles.salePrice}>{formatVnd(product.price)}</Text>
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <Text style={styles.comparePrice}>{formatVnd(product.compareAtPrice)}</Text>
            ) : null}
          </View>


          <Text style={styles.descriptionText}>{product.description}</Text>

          <View style={styles.divider} />

          <View style={styles.variantHeaderRow}>
            <Text style={styles.sectionHeading}>CHỌN SIZE VÀ MÀU</Text>
            <Text style={styles.stockCountText}>
              {variant ? `Còn ${variant.quantity} sản phẩm` : 'Hết hàng'}
            </Text>
          </View>


          <View style={styles.variantsWrapper}>
            {product.variants.map(item => {
              const isSelected = variant?._id === item._id;
              const isOutOfStock = !item.isActive || item.quantity < 1;
              const colorDotHex = item.colorHex || '#dfd5c6';

              return (
                <Pressable
                  key={item._id}
                  disabled={isOutOfStock}
                  onPress={() => selectVariant(item)}
                  style={[
                    styles.variantChip,
                    isSelected && styles.variantChipSelected,
                    isOutOfStock && styles.variantChipDisabled
                  ]}
                >
                  <View style={[styles.variantDot, { backgroundColor: colorDotHex }]} />
                  <Text
                    style={[
                      styles.variantChipText,
                      isSelected && styles.variantChipTextSelected
                    ]}
                  >
                    {item.size} • {item.color}
                    {isOutOfStock ? ' · Hết' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>


        <View style={styles.reviewsCard}>
          <View style={styles.reviewsHeaderRow}>
            <View style={styles.reviewsHeaderLeft}>
              <Text style={styles.reviewsHeading}>Đánh giá</Text>
              <View style={styles.reviewsCountBadge}>
                <Text style={styles.reviewsCountText}>{reviewCount}</Text>
              </View>
            </View>
            {reviewCount > 0 ? (
              renderStars(Math.round(avgRatingNum), 5, 13)
            ) : (
              <Text style={styles.noRatingText}>Chưa có xếp hạng</Text>
            )}
          </View>

          {reviewCount > 0 ? (
            <View style={styles.reviewsList}>
              {reviews.map(review => (
                <View key={review._id} style={styles.reviewItem}>
                  <View style={styles.reviewCardTop}>
                    <View style={styles.reviewerAvatar}>
                      <Text style={styles.reviewerAvatarText}>
                        {getInitials(review.user?.name)}
                      </Text>
                    </View>
                    <View style={styles.reviewerMeta}>
                      <Text style={styles.reviewerName}>
                        {review.user?.name || 'Khách hàng'}
                      </Text>
                      {renderStars(review.rating, 5, 11)}
                    </View>
                    <Text style={styles.reviewTime}>
                      {formatRelativeTime(review.createdAt)}
                    </Text>
                  </View>

                  {review.comment ? (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  ) : null}

                  {review.adminReply ? (
                    <View style={styles.adminReplyBox}>
                      <View style={styles.adminReplyHeader}>
                        <Image
                          source={{ uri: ICONS.checkCircle }}
                          style={styles.checkCircleIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.adminReplyTitle}>
                          Phản hồi từ FITZY Store:
                        </Text>
                      </View>
                      <Text style={styles.adminReplyBody}>
                        {review.adminReply}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noReviewsBox}>
              <Text style={styles.noReviewsText}>
                Chưa có đánh giá nào cho sản phẩm này.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>


      {notice ? (
        <View style={styles.floatingNotice}>
          <Text style={styles.noticeText}>{notice}</Text>
        </View>
      ) : null}


      <View style={styles.floatingFooter}>
        <Pressable
          accessibilityRole="button"
          disabled={!variant || variant.quantity < 1}
          onPress={addToBag}
          style={({ pressed }) => [
            styles.primaryBtn,
            (!variant || variant.quantity < 1) && styles.btnDisabled,
            pressed && { opacity: 0.9 }
          ]}
        >
          <Image source={{ uri: ICONS.bag }} style={styles.btnIconWhite} resizeMode="contain" />
          <Text style={styles.primaryBtnText}>Thêm vào túi đồ</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={toggleFavorite}
          style={({ pressed }) => [
            styles.secondaryBtn,
            pressed && { backgroundColor: '#f4f2ee' }
          ]}
        >
          <Image
            source={{ uri: favorite ? ICONS.heartFill : ICONS.heartOutline }}
            style={styles.btnIconDark}
            resizeMode="contain"
          />
          <Text style={styles.secondaryBtnText}>
            {favorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAnchorBorder: {
    height: 1,
    backgroundColor: '#ece8e1',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 155,
  },
  heroImageBox: {
    height: 380,
    borderRadius: 20,
    backgroundColor: '#ede9e1',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ece8e1',
    marginBottom: 14,
  },
  badgePill: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#181818',
    letterSpacing: 0.5,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  noImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9e998e',
    letterSpacing: 1.5,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ece8e1',
    padding: 18,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777570',
    letterSpacing: 1,
  },
  ratingSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 14,
    color: '#b8944d',
    marginRight: 4,
  },
  ratingNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#181818',
    marginRight: 4,
  },
  ratingCountText: {
    fontSize: 12,
    color: '#8c8880',
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#181818',
    lineHeight: 29,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  salePrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8b5a2b',
    marginRight: 10,
  },
  comparePrice: {
    fontSize: 14,
    color: '#9c9890',
    textDecorationLine: 'line-through',
  },
  descriptionText: {
    fontSize: 13.5,
    color: '#66645f',
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f2eee7',
    marginVertical: 14,
  },
  variantHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#181818',
    letterSpacing: 0.8,
  },
  stockCountText: {
    fontSize: 12,
    color: '#8c8880',
  },
  variantsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  variantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2dfd7',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  variantChipSelected: {
    backgroundColor: '#181818',
    borderColor: '#181818',
  },
  variantChipDisabled: {
    opacity: 0.45,
  },
  variantDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  variantChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#181818',
  },
  variantChipTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  reviewsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ece8e1',
    padding: 18,
    marginBottom: 14,
  },
  reviewsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  reviewsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#181818',
  },
  reviewsCountBadge: {
    backgroundColor: '#ece8e1',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  reviewsCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#181818',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noRatingText: {
    fontSize: 12,
    color: '#8c8880',
  },
  reviewsList: {
    gap: 14,
  },
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: '#f4f2ee',
    paddingTop: 12,
  },
  reviewCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ede9e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#181818',
  },
  reviewerMeta: {
    flex: 1,
    marginLeft: 12,
  },
  reviewerName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#181818',
    marginBottom: 2,
  },
  reviewTime: {
    fontSize: 11.5,
    color: '#8e8b85',
  },
  reviewComment: {
    fontSize: 13,
    color: '#3f3d39',
    lineHeight: 19,
    marginTop: 10,
  },
  adminReplyBox: {
    backgroundColor: '#f7f5f0',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5a2b',
  },
  adminReplyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkCircleIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  adminReplyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#181818',
  },
  adminReplyBody: {
    fontSize: 12,
    color: '#66645f',
    lineHeight: 18,
  },
  noReviewsBox: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  noReviewsText: {
    fontSize: 13,
    color: '#8c8880',
  },
  floatingNotice: {
    position: 'absolute',
    bottom: 142,
    left: 20,
    right: 20,
    backgroundColor: '#181818',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 99,
  },
  noticeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  floatingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.paper,
    borderTopWidth: 1,
    borderTopColor: '#ece8e1',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 26 : 16,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  primaryBtn: {
    height: 48,
    backgroundColor: '#141414',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  secondaryBtn: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ece8e1',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#181818',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  btnIconWhite: {
    width: 18,
    height: 18,
    tintColor: '#ffffff',
  },
  btnIconDark: {
    width: 18,
    height: 18,
  },
});
