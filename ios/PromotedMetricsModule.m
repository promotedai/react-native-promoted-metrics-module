#import "React/RCTBridgeModule.h"

/** See src/index.tsx for method docs. */
@interface RCT_EXTERN_REMAP_MODULE(PromotedMetrics, PromotedMetricsModule, NSObject)

#pragma mark - Starting new sessions
RCT_EXTERN_METHOD(startSessionAndLogUser:(NSString *)userID)

RCT_EXTERN_METHOD(startSessionAndLogSignedOutUser)

#pragma mark - Impressions
/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logImpression:(nullable NSDictionary *)content)

#pragma mark - Clicks

RCT_EXTERN_METHOD(logNavigateAction:(NSString *)screenName)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logNavigateActionWithContent:(NSString *)screenName
                  forContent:(nullable NSDictionary *)content)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logAddToCartAction:(nullable NSDictionary *)item)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logRemoveFromCartAction:(nullable NSDictionary *)item)

RCT_EXTERN_METHOD(logCheckoutAction)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logPurchaseAction:(nullable NSDictionary *)item)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logShareAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logLikeAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logUnlikeAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logCommentAction:(nullable NSDictionary *)content)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logMakeOfferAction:(nullable NSDictionary *)item)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logAskQuestionAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logAnswerQuestionAction:(nullable NSDictionary *)content)

RCT_EXTERN_METHOD(logCompleteSignIn)

RCT_EXTERN_METHOD(logCompleteSignUp)

RCT_EXTERN_METHOD(logAction:(NSString *)name)

RCT_EXTERN_METHOD(logActionWithType:(NSString *)name
                  type:(NSInteger)type)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logActionWithContent:(NSString *)name
                  type:(NSInteger)type
                  content:(nullable NSDictionary *)content)

#pragma mark - Views
RCT_EXTERN_METHOD(logView:(NSString *)screenName)

RCT_EXTERN_METHOD(logViewWithUseCase:(NSString *)screenName
                  useCase:(NSInteger)useCase)

#pragma mark - ImpressionLogger
RCT_EXTERN_METHOD(collectionViewDidLoad:(NSString *)collectionViewName)

/// @param visibleContent (`NSArray<NSDictionary<String, id>>`)
RCT_EXTERN_METHOD(collectionViewDidChange:(NSArray *)visibleContent
                  collectionViewName:(NSString *)collectionViewName)

RCT_EXTERN_METHOD(collectionViewDidUnmount:(NSString *)collectionViewName)

@end
