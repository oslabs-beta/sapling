export function formatActivation(activation, author) {
    return {
        id                       : activation.id,
        name                     : activation.name,
        linkToPass               : activation.linkToPass,
        publicLink               : activation.publicLink,
        actionId                 : activation.links ? activation.links.action.id : '',
        numberOfQuestions        : activation.numberOfQuestions,
        numberOfAccountsPassed      : activation.numberOfPeople,
        dueTime                  : activation.dueTime,
        message                  : activation.message,
        category                 : activation.category,
        isSponsored              : activation.isSponsored,
        isPrivate                : activation.isPublic === false,
        canPassViaChat           : activation.canPassViaChat,
        isPassed                 : activation.assigneeQuizSession && activation.assigneeQuizSession.finishedAt,
        accountQuizSession          : formatAccountQuizSession(activation.assigneeQuizSession),
        pictureURL               : activation.pictureURL,
        tags                     : activation.tags,
        timeToPass               : activation.timeToPass,
        author                   : author ? formatAccountInfo(author) : {},
        canAssigneePass          : activation.canAssigneePass,
        numberOfTriesLeft        : activation.numberOfTriesLeft || 0,
        assessmentSystemId       : activation.assessmentSystemId,
        assessmentSystemType     : activation.assessmentSystemType,
        canAssigneeViewQuestions : activation.canAssigneeViewQuestions,
        passingsLeft             : activation.passingsLeft
    };
}

export function formatAccountInfo(account) {
    let smallAvatarUrl = account.smallAvatarUrl;

    if (!isAvatarStandard(account.avatarUrl) && isAvatarStandard(account.smallAvatarUrl)) {
        smallAvatarUrl = account.avatarUrl;
    }

    return {
        smallAvatarUrl,
        id              : account.id,
        isTrusted       : account.isTrusted,
        type            : account.type,
        fullName        : _getAccountFullName(account),
        avatar          : account.avatarUrl,
        backgroundURL   : account.backgroundURL
    };
}

export function formatAuthorProfileData(account) {
    return {
        id            : account.id,
        country       : account.country,
        city          : account.city,
        industry      : account.industry,
        isTrusted     : account.isTrusted,
        type          : account.type,
        firstName     : account.firstName,
        secondName    : account.secondName,
        lastName      : account.lastName,
        companyName   : account.companyName,
        pictureURL    : account.avatarUrl,
        backgroundURL : account.backgroundURL
    };
}

export function formatAccountQuizSession(session) {
    if (!session || !session.createdAt) {
        return null;
    }

    const accountGainedPoints = Math.round(+session.gainedPoints * 100) / 100 || 0;
    let accountScore = 0;

    if (+session.maxPoints > 0) {
        accountScore = Math.round(+accountGainedPoints * 100 / +session.maxPoints);
    }

    return {
        canViewAnswers          : session.canAssigneeViewQuestions,
        startedAt               : session.startedAt,
        shareResultLink         : session.resultShareLink || '',
        finishedAt              : session.finishedAt,
        score                   : accountScore,
        gainedPoints            : accountGainedPoints,
        maxPoints               : session.maxPoints,
        status                  : session.status,
        id                      : session.id,
        resultBackground        : _getResultBackground(accountScore),
        answeredQuestionsNumber : session.numberOfAnsweredQuestions,
        totalQuestionsNumber    : session.questions.length
    };
}

function _getAccountFullName({ firstName, secondName, ...account }) {
    if (account.type === 'COMPANY') {
        return account.companyName;
    }

    return firstName || secondName
        ? `${firstName}  ${secondName}`
        : 'It`s quiz user';
}

function _getResultBackground(score) {
    if (score > 95) {
        return 'excellent';
    }

    if (score > 75) {
        return 'good';
    }

    if (score > 50) {
        return 'normal';
    }

    if (score > 30) {
        return 'bad';
    }

    return 'verybad';
}

function isAvatarStandard(avatar) {
    return avatar.includes('profile') || avatar.includes('companyProfile');
}
