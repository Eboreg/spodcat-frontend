import type Store from "@ember-data/store";
import { action } from "@ember/object";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import { runTask } from "ember-lifeline";
import type ChallengeModel from "podcast-frontend/models/challenge";
import type CommentModel from "podcast-frontend/models/comment";
import type PodcastContentModel from "podcast-frontend/models/podcast-content";
import type MessageService from "podcast-frontend/services/message";

export interface PodcastContentCommentsSignature {
    Args: {
        content: PodcastContentModel;
    };
}

export default class PodcastContentComments extends Component<PodcastContentCommentsSignature> {
    @service declare fastboot: FastBoot;
    @service declare message: MessageService;
    @service declare store: Store;
    @service declare intl: Registry["intl"];

    @tracked challenge?: ChallengeModel;
    @tracked comment?: CommentModel;

    get comments() {
        return this.args.content.comments.filter((c) => !c.isNew && c["is-approved"]);
    }

    get hasComments() {
        return this.comments.length > 0;
    }

    get isSubmitDisabled() {
        return (
            !this.comment?.name ||
            !this.comment.text ||
            !this.comment["challenge-answer"] ||
            !!this.comment.errors.length
        );
    }

    get showCommentForm() {
        return !this.fastboot.isFastBoot && this.args.content.podcast["enable-comments"];
    }

    constructor(...args: ConstructorParameters<typeof Component<PodcastContentCommentsSignature>>) {
        super(...args);

        if (!this.fastboot.isFastBoot) {
            this.resetComment();
            void this.resetChallenge();
        }
    }

    @action async onSubmitComment() {
        try {
            const toast = this.args.content.podcast["require-comment-approval"]
                ? this.intl.t("comment.thanks.approval-required")
                : this.intl.t("comment.thanks.no-approval-required");

            await this.comment?.save();
            this.message.addToast({ level: "success", text: toast });
            this.resetComment();
            void this.resetChallenge();
        } catch {
            this.message.addToast({ level: "error", text: this.intl.t("comment.something-wrong") });
        }
    }

    async resetChallenge() {
        this.challenge = this.store.createRecord<ChallengeModel>("challenge", { podcast: this.args.content.podcast });
        await this.challenge.save();
        if (this.comment) {
            this.comment["challenge-answer"] = undefined;
            if (this.challenge.id) {
                this.comment.challenge = this.challenge.id;
            }
        }
    }

    resetComment() {
        runTask(this, () => {
            this.comment = this.store.createRecord<CommentModel>("comment", {
                "podcast-content": this.args.content,
            });
        });
    }

    willDestroy() {
        super.willDestroy();
        void this.challenge?.destroyRecord();
    }
}
