declare namespace API {
  type BaseResponseboolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseChatSession = {
    code?: number;
    data?: ChatSession;
    message?: string;
  };

  type BaseResponseHomeVO = {
    code?: number;
    data?: HomeVO;
    message?: string;
  };

  type BaseResponseint = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListChatMessage = {
    code?: number;
    data?: ChatMessage[];
    message?: string;
  };

  type BaseResponseListChatSession = {
    code?: number;
    data?: ChatSession[];
    message?: string;
  };

  type BaseResponseListCommentVO = {
    code?: number;
    data?: CommentVO[];
    message?: string;
  };

  type BaseResponseListNotice = {
    code?: number;
    data?: Notice[];
    message?: string;
  };

  type BaseResponseListOrderVO = {
    code?: number;
    data?: OrderVO[];
    message?: string;
  };

  type BaseResponseListPostVO = {
    code?: number;
    data?: PostVO[];
    message?: string;
  };

  type BaseResponseListProductVO = {
    code?: number;
    data?: ProductVO[];
    message?: string;
  };

  type BaseResponseListScoreVO = {
    code?: number;
    data?: ScoreVO[];
    message?: string;
  };

  type BaseResponseListstring = {
    code?: number;
    data?: string[];
    message?: string;
  };

  type BaseResponseListTaskVO = {
    code?: number;
    data?: TaskVO[];
    message?: string;
  };

  type BaseResponseListUser = {
    code?: number;
    data?: User[];
    message?: string;
  };

  type BaseResponselong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseNotice = {
    code?: number;
    data?: Notice;
    message?: string;
  };

  type BaseResponseobject = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseOrderVO = {
    code?: number;
    data?: OrderVO;
    message?: string;
  };

  type BaseResponsePostVO = {
    code?: number;
    data?: PostVO;
    message?: string;
  };

  type BaseResponseProductVO = {
    code?: number;
    data?: ProductVO;
    message?: string;
  };

  type BaseResponsestring = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseTaskDataVO = {
    code?: number;
    data?: TaskDataVO;
    message?: string;
  };

  type BaseResponseUser = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type BaseResponseWebsiteVO = {
    code?: number;
    data?: WebsiteVO;
    message?: string;
  };

  type changeShelvesUsingGETParams = {
    /** id */
    id: number;
  };

  type ChatMessage = {
    /** 内容 */
    content?: string;
    /** 创建时间 */
    created_time?: string;
    /** 信息id */
    id?: number;
    isDelete?: number;
    /** 角色 */
    role?: string;
    /** 聊天id */
    session_id?: number;
  };

  type ChatSession = {
    /** 创建时间 */
    created_time?: string;
    /** 聊天id */
    id?: number;
    isDelete?: number;
    /** 模型 */
    model?: string;
    /** 会话图像 */
    session_image?: string;
    /** 会话名称 */
    session_name?: string;
    /** 概要 */
    summary?: string;
    /** 用户id */
    user_id?: number;
  };

  type CommentAddRequest = {
    content?: string;
    parent_id?: number;
    post_id?: number;
    root_parent_id?: number;
    user_id?: number;
    user_name?: string;
  };

  type CommentDeleteRequest = {
    id?: number;
  };

  type CommentVO = {
    child?: CommentVO[];
    content?: string;
    createTime?: string;
    id?: number;
    parent_id?: number;
    post_id?: number;
    post_name?: string;
    root_parent_id?: number;
    updateTime?: string;
    user?: UserVO;
    user_id?: number;
  };

  type CreateChatRequest = {
    /** 模型 */
    model?: string;
    /** 用户id */
    userId?: number;
  };

  type CreateNoticeDto = {
    content?: string;
    create_user?: string;
    end_time?: string;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
  };

  type CreateUserDto = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    /** 账号 */
    username?: string;
  };

  type createVipOrderUsingPOSTParams = {
    /** days */
    days: number;
  };

  type DeleteNoticeDto = {
    /** 通知id */
    notice_id?: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type deleteUserUsingDELETEParams = {
    /** user_id */
    user_id: number;
  };

  type favourPostUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type Feature = {
    content?: string;
    icon?: string;
    title?: string;
  };

  type generateSummaryUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type getChatMessagesUsingGETParams = {
    /** sessionId */
    sessionId: number;
  };

  type getChatSessionsUsingGETParams = {
    /** userId */
    userId: number;
  };

  type getCommentBySearchTextUsingGETParams = {
    /** searchText */
    searchText: string;
  };

  type getCommentsByPostIdUsingGETParams = {
    /** postId */
    postId: number;
  };

  type getOrderVOByIdUsingGETParams = {
    /** id */
    id: number;
  };

  type getPostVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getProductByIdUsingGETParams = {
    /** id */
    id: number;
  };

  type getProductsByTagsUsingGETParams = {
    /** tags */
    tags?: string;
  };

  type getUserByUserIdUsingGETParams = {
    /** user_id */
    user_id?: number;
  };

  type getUsersByCategoryUsingGETParams = {
    /** category */
    category?: string;
    /** ascending */
    ascending?: boolean;
  };

  type getUsersBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };

  type HomeVO = {
    commentCount?: number;
    commentList?: CommentVO[];
    notice?: Notice;
    orderCount?: number;
    orderList?: OrderVO[];
    orderTotalPrice?: number;
    postCount?: number;
    postList?: PostVO[];
    productCount?: number;
    productList?: ProductVO[];
    userCount?: number;
    visitCount?: number;
  };

  type incrementViewUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type listPagedPostsUsingGETParams = {
    /** page */
    page?: number;
    /** size */
    size?: number;
  };

  type listPostsByTagUsingGETParams = {
    /** tag */
    tag?: string;
  };

  type LoginRequest = {
    geetestChallenge?: string;
    geetestSeccode?: string;
    geetestValidate?: string;
    password?: string;
    username?: string;
  };

  type ModelAndView = {
    empty?: boolean;
    model?: Record<string, any>;
    modelMap?: Record<string, any>;
    reference?: boolean;
    status?:
      | "ACCEPTED"
      | "ALREADY_REPORTED"
      | "BAD_GATEWAY"
      | "BAD_REQUEST"
      | "BANDWIDTH_LIMIT_EXCEEDED"
      | "CHECKPOINT"
      | "CONFLICT"
      | "CONTINUE"
      | "CREATED"
      | "DESTINATION_LOCKED"
      | "EXPECTATION_FAILED"
      | "FAILED_DEPENDENCY"
      | "FORBIDDEN"
      | "FOUND"
      | "GATEWAY_TIMEOUT"
      | "GONE"
      | "HTTP_VERSION_NOT_SUPPORTED"
      | "IM_USED"
      | "INSUFFICIENT_SPACE_ON_RESOURCE"
      | "INSUFFICIENT_STORAGE"
      | "INTERNAL_SERVER_ERROR"
      | "I_AM_A_TEAPOT"
      | "LENGTH_REQUIRED"
      | "LOCKED"
      | "LOOP_DETECTED"
      | "METHOD_FAILURE"
      | "METHOD_NOT_ALLOWED"
      | "MOVED_PERMANENTLY"
      | "MOVED_TEMPORARILY"
      | "MULTIPLE_CHOICES"
      | "MULTI_STATUS"
      | "NETWORK_AUTHENTICATION_REQUIRED"
      | "NON_AUTHORITATIVE_INFORMATION"
      | "NOT_ACCEPTABLE"
      | "NOT_EXTENDED"
      | "NOT_FOUND"
      | "NOT_IMPLEMENTED"
      | "NOT_MODIFIED"
      | "NO_CONTENT"
      | "OK"
      | "PARTIAL_CONTENT"
      | "PAYLOAD_TOO_LARGE"
      | "PAYMENT_REQUIRED"
      | "PERMANENT_REDIRECT"
      | "PRECONDITION_FAILED"
      | "PRECONDITION_REQUIRED"
      | "PROCESSING"
      | "PROXY_AUTHENTICATION_REQUIRED"
      | "REQUESTED_RANGE_NOT_SATISFIABLE"
      | "REQUEST_ENTITY_TOO_LARGE"
      | "REQUEST_HEADER_FIELDS_TOO_LARGE"
      | "REQUEST_TIMEOUT"
      | "REQUEST_URI_TOO_LONG"
      | "RESET_CONTENT"
      | "SEE_OTHER"
      | "SERVICE_UNAVAILABLE"
      | "SWITCHING_PROTOCOLS"
      | "TEMPORARY_REDIRECT"
      | "TOO_EARLY"
      | "TOO_MANY_REQUESTS"
      | "UNAUTHORIZED"
      | "UNAVAILABLE_FOR_LEGAL_REASONS"
      | "UNPROCESSABLE_ENTITY"
      | "UNSUPPORTED_MEDIA_TYPE"
      | "UPGRADE_REQUIRED"
      | "URI_TOO_LONG"
      | "USE_PROXY"
      | "VARIANT_ALSO_NEGOTIATES";
    view?: View;
    viewName?: string;
  };

  type Notice = {
    content?: string;
    /** 创建时间 */
    createTime?: string;
    create_user?: string;
    end_time?: string;
    isDelete?: number;
    /** 通知id */
    notice_id?: number;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
    /** 更新时间 */
    updateTime?: string;
    update_user?: string;
  };

  type OrderCreateRequest = {
    payMethod?: string;
    productId?: number;
  };

  type OrderUpdateRequest = {
    id?: number;
    status?: string;
  };

  type OrderVO = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    money?: number;
    payTime?: string;
    paymentMethod?: string;
    product?: ProductVO;
    productId?: number;
    status?: number;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type payUsingGETParams = {
    /** orderId */
    orderId: number;
  };

  type PostAddRequest = {
    content?: string;
    cover?: string;
    tagList?: string[];
    title?: string;
  };

  type PostDeleteRequest = {
    post_id?: number;
  };

  type PostGenerateRequest = {
    prompt?: string;
  };

  type PostQueryRequest = {
    current?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type PostUpdateRequest = {
    content?: string;
    cover?: string;
    id?: number;
    tagList?: string[];
    title?: string;
  };

  type PostVO = {
    content?: string;
    cover?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isFavoured?: boolean;
    isThumbed?: boolean;
    tagList?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
    viewsNum?: number;
  };

  type ProductAddRequest = {
    content?: string;
    description?: string;
    images?: string;
    price?: number;
    stock?: number;
    tags?: string;
    title?: string;
    userId?: number;
  };

  type ProductUpdateRequest = {
    buyNum?: number;
    content?: string;
    description?: string;
    id?: number;
    images?: string;
    isShelves?: number;
    price?: number;
    stock?: number;
    tags?: string;
    title?: string;
    userId?: number;
    viewsNum?: number;
  };

  type ProductVO = {
    buyNum?: number;
    content?: string;
    createTime?: string;
    description?: string;
    id?: number;
    images?: string;
    isBuy?: number;
    isShelves?: number;
    price?: number;
    stock?: number;
    tags?: string[];
    title?: string;
    type?: string;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
    viewsNum?: number;
  };

  type RegisterUserDto = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 确认密码 */
    confirmPassword?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 性别 */
    sex?: string;
    /** 账号 */
    username?: string;
  };

  type ScoreCreateRequest = {
    /** 关联评分id */
    linkId?: number;
  };

  type ScoreUpdateRequest = {
    /** 评价 */
    appraisal?: string;
    /** id */
    id?: number;
    /** 分数 */
    score?: number;
  };

  type ScoreVO = {
    /** 评价 */
    appraisal?: string;
    /** 创建时间 */
    createTime?: string;
    /** id */
    id?: number;
    /** 关联评分id */
    linkId?: number;
    /** 评分用户VO */
    markUser?: UserVO;
    /** 评分用户 id */
    markUserId?: number;
    /** 分数 */
    score?: number;
    /** 关联文章 */
    task?: TaskVO;
    /** 更新时间 */
    updateTime?: string;
    /** 用户VO */
    user?: UserVO;
    /** 用户id */
    userId?: number;
  };

  type searchOrderBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };

  type searchPostBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };

  type searchProductBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };

  type SearchRequest = {
    searchText?: string;
  };

  type searchUsingPOSTParams = {
    /** searchText */
    searchText?: string;
  };

  type TaskAddRequest = {
    endTime?: string;
    linkId?: number;
    principalId?: number;
    priority?: string;
    startTime?: string;
    status?: string;
    taskName?: string;
    userId?: number;
  };

  type TaskCategoryRequest = {
    ascending?: string;
    category?: string;
  };

  type TaskDataVO = {
    doingTaskCount?: number;
    finishTaskCount?: number;
    taskCount?: number;
    unFinishTaskCount?: number;
  };

  type TaskGetStatusRequest = {
    status?: string;
    userId?: number;
  };

  type TaskGetUserRequest = {
    userId?: number;
  };

  type TaskSearchRequest = {
    searchText?: string;
  };

  type TaskUpdateRequest = {
    endTime?: string;
    id?: number;
    linkId?: number;
    principalId?: number;
    priority?: string;
    progress?: number;
    startTime?: string;
    status?: string;
    taskName?: string;
    userId?: number;
  };

  type TaskVO = {
    createTime?: string;
    endTime?: string;
    id?: number;
    linkId?: number;
    post?: PostVO;
    principal?: UserVO;
    principalId?: number;
    priority?: string;
    progress?: number;
    startTime?: string;
    status?: string;
    taskName?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type thumbPostUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type UpdateByAdminRequest = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    user_id?: number;
    /** 账号 */
    username?: string;
  };

  type UpdateByUserRequest = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 性别 */
    sex?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
  };

  type UpdateChatModelRequest = {
    /** id */
    id?: number;
    /** 模型 */
    model?: string;
  };

  type UpdateNoticeDto = {
    content?: string;
    end_time?: string;
    /** 通知id */
    notice_id?: number;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
    update_user?: string;
  };

  type UpdatePasswordRequest = {
    /** 确认新密码 */
    confirmPassword?: string;
    /** 新密码 */
    newPassword?: string;
    /** 旧密码 */
    oldPassword?: string;
    user_id?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 创建时间 */
    createTime?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    isDelete?: number;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    /** 更新时间 */
    updateTime?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
    /** vip到期时间 */
    vipEndTime?: string;
    /** vip开始时间 */
    vipStartTime?: string;
  };

  type UserMessageRequest = {
    /** 内容 */
    content?: string;
    /** 模型 */
    model?: string;
    /** 会话id */
    sessionId?: number;
  };

  type UserVO = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 创建时间 */
    createTime?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 是否vip */
    isVip?: number;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    token?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
    /** vip到期时间 */
    vipEndTime?: string;
    /** vip开始时间 */
    vipStartTime?: string;
  };

  type View = {
    contentType?: string;
  };

  type WebsiteVO = {
    contact_address?: string;
    contact_email?: string;
    contact_name?: string;
    contact_phone?: string;
    cover_url?: string;
    /** 网站特点描述 */
    features?: Feature[];
    footer_info?: string;
    id?: number;
    logo_url?: string;
    site_description?: string;
    site_name?: string;
    visit_count?: number;
  };
}
