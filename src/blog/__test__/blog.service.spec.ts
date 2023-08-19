import path from 'path';
import { BlogService } from '../blog.service';
import { BlogRepository } from '../repository';
import { Filesystem } from '../../common/utils';
import { UploadDirs } from '../../common/constant';
import { NotFoundException } from '@nestjs/common';

const fakeBlog = () => {
  return {
    id: '33dfda56-8778-492c-a8cd-d23fa895223b',
    publisherId: '42d0d724-5b99-45b3-9445-16f2e16a9aab',
    title: 'this is a title',
    content: 'this is a blog',
    thumbnail: 'skldjfsldkdfslkf',
    createdAt: '2023-08-19T07:03:13.759Z',
    updateAt: '2023-08-19T07:03:13.759Z',
  };
};

describe('Blog Service [Unit-Test]', () => {
  let blogRepo: BlogRepository;
  let blogService: BlogService;

  beforeAll(() => {
    blogRepo = new BlogRepository(jest.fn() as any);
    blogService = new BlogService(blogRepo);
  });

  it('shoud be defined', () => {
    expect(blogRepo).toBeDefined();
    expect(blogService).toBeDefined();
  });

  describe('getBlogs()', () => {
    it('shoud return blogs', () => {
      jest.spyOn(blogRepo, 'find').mockResolvedValueOnce([fakeBlog()] as any);

      expect(blogService.getBlogs({})).resolves.toEqual([fakeBlog()]);
    });
  });

  describe('getOneBlog()', () => {
    it('shoud throw 404 if blog is not found', () => {
      jest.spyOn(blogRepo, 'findOne').mockResolvedValueOnce(null);

      expect(blogService.getOneBlog('blogId')).rejects.toThrow(NotFoundException);
    });

    it('shodu return a blog', () => {
      jest.spyOn(blogRepo, 'findOne').mockResolvedValueOnce(fakeBlog() as any);

      expect(blogService.getOneBlog('blogId')).resolves.toEqual(fakeBlog());
    });
  });

  describe('publishBlog()', () => {
    it('shoud publish a blog', () => {
      const body = {
        content: 'content',
        title: 'title',
      };

      jest.spyOn(blogRepo, 'create').mockResolvedValueOnce(fakeBlog() as any);

      expect(
        blogService.publishBlog('publisherId', body, 'thumbnail'),
      ).resolves.toEqual(fakeBlog());
    });
  });

  describe('deleteBlog()', () => {
    it('shoud throw 404 if blog is not found', () => {
      jest.spyOn(blogRepo, 'deleteOne').mockResolvedValueOnce(null);

      expect(blogService.deleteBlog('blogId', 'publisherId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('shoud delete a blog', async () => {
      jest.spyOn(blogRepo, 'deleteOne').mockResolvedValueOnce(fakeBlog());

      jest.spyOn(Filesystem, 'deleteIfExists').mockImplementation();

      await expect(
        blogService.deleteBlog('blogId', 'publisherId'),
      ).resolves.toBeUndefined();

      expect(Filesystem.deleteIfExists).toBeCalledWith(
        path.join(
          process.env.UPLOAD_DIR,
          UploadDirs.BlogThumbnail,
          fakeBlog().thumbnail,
        ),
      );
    });
  });

  describe('updateBlog()', () => {
    const body = { blogId: 'blogId', title: 'title' };

    it('shoud throw 404 if blog is not found', () => {
      jest.spyOn(blogRepo, 'updateOne').mockResolvedValueOnce(null);

      expect(blogService.updateBlog(body, 'thumbnail')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('shoud update a blog', async () => {
      jest.spyOn(blogRepo, 'updateOne').mockResolvedValueOnce(fakeBlog());

      jest.spyOn(Filesystem, 'rename').mockImplementation();

      await expect(blogService.updateBlog(body, 'randomfilename')).resolves.toEqual(
        fakeBlog(),
      );

      const basePath = path.join(process.env.UPLOAD_DIR, UploadDirs.BlogThumbnail);

      expect(Filesystem.rename).toBeCalledWith(
        path.join(basePath, 'randomfilename'),
        path.join(basePath, fakeBlog().thumbnail),
      );
    });
  });
});
