import { NotFoundException } from '@nestjs/common';
import { CommentService } from '../comment.service';
import { BlogRepository, CommentRepository } from '../repository';

const fakeComment = () => {
  return {
    id: 'e126a7b4-9a37-4d07-a408-34233067558c',
    userId: '27c7e4e1-e9ed-4b91-9bba-47707bd3e2d0',
    blogId: 'bfb12b56-8059-4bc5-980d-d33f60627345',
    body: 'this is a body',
    createdAt: '2023-08-19T06:26:13.632Z',
    updatedAt: '2023-08-19T06:26:13.632Z',
  };
};

describe('Comment Service [Unit-Test]', () => {
  let blogRepo: BlogRepository;
  let commentRepo: CommentRepository;
  let commentService: CommentService;

  beforeAll(() => {
    blogRepo = new BlogRepository(jest.fn() as any);
    commentRepo = new CommentRepository(jest.fn() as any);
    commentService = new CommentService(commentRepo, blogRepo);
  });

  it('shoud be defined', () => {
    expect(blogRepo).toBeDefined();
    expect(commentRepo).toBeDefined();
    expect(commentService).toBeDefined();
  });

  describe('getComments()', () => {
    it('shoud get comments', () => {
      jest.spyOn(commentRepo, 'getAll').mockReturnValue([fakeComment()] as any);

      expect(commentService.getComments({}, 'blogId')).resolves.toEqual([
        fakeComment(),
      ]);
    });
  });

  describe('sendComment()', () => {
    const body = {
      blogId: 'blogId',
      body: 'this is a body',
    };

    it('shoud throw 404 error if blog is not found', () => {
      jest.spyOn(blogRepo, 'exists').mockResolvedValue(false);
      expect(commentService.sendComment(body, 'clientId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('shoud send comment', () => {
      jest.spyOn(blogRepo, 'exists').mockResolvedValue(true);
      jest.spyOn(commentRepo, 'create').mockResolvedValue(fakeComment() as any);

      expect(commentService.sendComment(body, 'clientId')).resolves.toEqual(
        fakeComment(),
      );
    });
  });

  describe('editComment()', () => {
    const body = {
      commentId: 'commentId',
      body: 'this is a new body',
    };

    it('shoud throw 404 error if blog is not found', () => {
      jest.spyOn(commentRepo, 'updateOne').mockResolvedValueOnce(null);

      expect(commentService.editComment(body, 'clientId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('shoud edit comment', () => {
      jest.spyOn(commentRepo, 'updateOne').mockResolvedValueOnce(fakeComment());

      expect(commentService.editComment(body, 'clientId')).resolves.toEqual(
        fakeComment(),
      );
    });
  });

  describe('deleteComment()', () => {
    it('shoud throw 404 error if blog is not found', () => {
      jest.spyOn(commentRepo, 'deleteOne').mockResolvedValueOnce(null);

      expect(commentService.deleteComment('commentId', 'clientId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('shoud delete comment', () => {
      jest.spyOn(commentRepo, 'deleteOne').mockResolvedValueOnce(fakeComment());

      expect(commentService.deleteComment('commentId', 'clientId')).resolves.toEqual(
        fakeComment(),
      );
    });
  });
});
